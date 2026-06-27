import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { updateOrderDetails } from '@/lib/services/orders';

const POSTEX_BASE = 'https://api.postex.pk/services/integration/api';
const POSTEX_STAGING = 'https://staging-api.postex.pk/services/integration/api';

function cleanPhone(phone: string): string {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('92') && digits.length === 12) {
    digits = '0' + digits.substring(2);
  }
  if (digits.length === 10 && digits.startsWith('3')) {
    digits = '0' + digits;
  }
  return digits;
}

function toInternationalPhone(phone: string): string {
  if (!phone) return '';
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0') && clean.length === 11) {
    clean = '92' + clean.slice(1);
  } else if (clean.startsWith('3') && clean.length === 10) {
    clean = '92' + clean;
  } else if (clean.startsWith('922') && clean.length === 11) {
    clean = '9232' + clean.slice(3);
  } else if (clean.startsWith('920') && clean.length === 13) {
    clean = '92' + clean.slice(3);
  }
  return clean;
}

async function getMerchantAddresses(token: string, baseUrl: string) {
  try {
    const res = await fetch(`${baseUrl}/order/v1/get-merchant-address`, {
      headers: { token, 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if ((data.statusCode === 200 || data.statusCode === '0200') && data.dist) {
      return data.dist;
    }
  } catch {}
  return [];
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, weight, packetCount, remarks } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    // Fetch order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, customers(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Fetch PostEx settings
    const { data: s } = await supabaseAdmin
      .from('store_settings')
      .select('*')
      .single();

    if (!s?.postex_enabled || !s?.postex_api_token) {
      return NextResponse.json({ success: false, error: 'PostEx is not configured. Set up API credentials in Settings > Courier Manager.' }, { status: 200 });
    }

    const baseUrl = s.postex_mode === 'production' ? POSTEX_BASE : POSTEX_STAGING;
    const token = s.postex_api_token;

    // Order details
    const customerName = order.customer_name || order.customers?.name || '';
    const customerPhone = cleanPhone(order.customer_phone || order.customers?.phone || '');
    const orderItems = Array.isArray(order.items) ? order.items : [];
    const firstItem = orderItems[0] || {};
    const itemName = firstItem.name || 'Order items';
    const itemSku = firstItem.sku || '';

    // Apply default product name if checkbox says so
    const deliveryDetail = (s.postex_product_check || '1') === '1'
      ? itemName
      : (s.postex_default_product || 'Kids Clothes');

    // Auto weight calculation
    let finalWeight = parseFloat(String(weight)) || parseFloat(s.postex_default_weight) || 0.5;
    if ((s.postex_weight_check || '1') !== '1') {
      finalWeight = parseFloat(s.postex_default_weight) || 0.5;
    }

    // Auto pieces calculation
    let finalItems = parseInt(String(packetCount)) || parseInt(s.postex_default_items) || 1;
    if ((s.postex_pieces_check || '1') !== '1') {
      finalItems = parseInt(s.postex_default_items) || 1;
    }

    // COD logic
    let totalAmount = parseFloat(order.total) || 0;
    if ((s.postex_cod_check || '0') === '1') {
      const searchText = `${remarks || ''} ${itemName} ${order.notes || ''}`.toLowerCase();
      if (searchText.includes('paid') || searchText.includes('prepaid') || searchText.includes('non-cod') || searchText.includes('non cod')) {
        totalAmount = 0;
      }
    }

    // Remarks logic
    let finalRemarks = remarks || '';
    const pNote = (remarks || '').trim();
    const dNote = (s.postex_default_remarks || '').trim();

    if ((s.postex_notes_check || '1') === '1') {
      if (pNote && dNote) {
        if (pNote.toLowerCase().includes(dNote.toLowerCase())) {
          finalRemarks = pNote;
        } else if (dNote.toLowerCase().includes(pNote.toLowerCase())) {
          finalRemarks = dNote;
        } else {
          finalRemarks = `${pNote} ${dNote}`;
        }
      } else {
        finalRemarks = pNote || dNote;
      }
    } else {
      finalRemarks = dNote || pNote;
    }

    if (!finalRemarks) {
      finalRemarks = 'Call before delivery';
    }

    // Resolve addresses from PostEx API
    let pickupCode = s.postex_pickup_address || '';
    let returnCode = s.postex_return_address || s.postex_pickup_address || '';
    let returnCity = (s.postex_return_city || '').trim().toUpperCase();
    let pickupText = s.postex_pickup_display || pickupCode;
    let returnText = s.postex_return_display || returnCode;

    try {
      const lists = await getMerchantAddresses(token, baseUrl);
      if (Array.isArray(lists) && lists.length > 0) {
        const retMatched = lists.find((a: any) => a.addressCode === s.postex_return_address)
          || lists.find((a: any) => a.addressCode === s.postex_pickup_address)
          || lists.find((a: any) => a.addressType === 'Return Address')
          || lists[0];

        if (retMatched) {
          if (!returnCity && retMatched.cityName) {
            returnCity = retMatched.cityName.trim().toUpperCase();
          }
          returnText = retMatched.address || returnText;
        }

        const pickMatched = lists.find((a: any) => a.addressCode === s.postex_pickup_address);
        if (pickMatched) {
          pickupText = pickMatched.address || pickupText;
        }
      }
    } catch {}

    if (!returnCity) {
      returnCity = 'KARACHI';
    }

    // Typo corrections for PostEx merchant DB
    if (pickupCode === '5450') pickupCode = '54500';
    if (returnCode === '5450') returnCode = '54500';

    // Normalize addresses to see if they are the same physical address
    const normPickup = pickupText.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const normReturn = returnText.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (normPickup === normReturn && pickupCode) {
      returnCode = pickupCode;
    }

    // Build SKU suffix
    let orderDetail = deliveryDetail;
    if ((s.postex_sku_check || '0') === '1' && itemSku) {
      orderDetail = `${deliveryDetail} (${itemSku})`;
    }

    // Build PostEx v3 create-order payload (matching Zaynahs postexApi.ts)
    const payload: Record<string, any> = {
      cityName: order.shipping_city || 'Karachi',
      customerName,
      customerPhone,
      deliveryAddress: order.shipping_address || 'N/A',
      invoiceDivision: 1,
      invoicePayment: totalAmount,
      items: finalItems,
      orderDetail,
      orderRefNumber: order.order_number || order.id,
      orderType: s.postex_order_type || 'Normal',
      transactionNotes: finalRemarks,
      pickupAddressCode: pickupCode,
      weight: finalWeight,
    };

    const res = await fetch(`${baseUrl}/order/v3/create-order`, {
      method: 'POST',
      headers: {
        token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json();

    if (res.status !== 200 && res.status !== 201) {
      const msg = responseData.statusMessage || responseData.message || responseData.error || `PostEx API error (${res.status})`;
      return NextResponse.json({ success: false, error: msg, details: responseData }, { status: 200 });
    }

    // Extract tracking info from PostEx response
    const trackingNumber = responseData.data?.trackingNumber || responseData.trackingNumber || responseData.data?.cn || responseData.cn || responseData.data?.awbNumber || responseData.awbNumber || '';
    const trackingUrl = trackingNumber
      ? `https://postex.pk/tracking?cn=${trackingNumber}`
      : '';

    // Update order with tracking info and set status to shipped
    await updateOrderDetails(orderId, {
      status: 'shipped',
      trackingNumber,
      courierName: 'PostEx',
      trackingUrl,
    });

    // ── WhatsApp Notification ──────────────────────────────────────────────
    // Compose a WhatsApp tracking alert using the template from settings
    const waPhone = toInternationalPhone(order.customer_phone || order.customers?.phone || '');
    const waName = order.customer_name || order.customers?.name || 'Customer';

    const waTemplate = s.postex_whatsapp_template || 'Dear {name}, your order has been booked. You can track it here: {url}\n{note}';
    const waSuffix = s.postex_whatsapp_note || '';

    let waMessage = waTemplate
      .replace(/\{name\}/g, waName)
      .replace(/\{url\}/g, trackingUrl)
      .replace(/\{note\}/g, finalRemarks || waSuffix);

    if (waSuffix && !waMessage.includes(waSuffix)) {
      waMessage += `\n\n${waSuffix}`;
    }

    let waSent = false;
    let waLink = '';
    if (waPhone && s.postex_whatsapp_template) {
      try {
        waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;
        await supabaseAdmin
          .from('orders')
          .update({
            status_logs: [
              ...(Array.isArray(order.status_logs) ? order.status_logs : []),
              {
                id: Math.random().toString(36).substring(2, 9),
                type: 'whatsapp_notification',
                message: `WhatsApp tracking alert ready for ${waPhone}`,
                waLink,
                status: 'shipped',
                createdAt: new Date().toISOString(),
              },
            ],
          })
          .eq('id', orderId);
        waSent = true;
      } catch (waErr) {
        console.error('[PostEx Dispatch] WhatsApp notification failed:', waErr);
      }
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      trackingUrl,
      courierName: 'PostEx',
      waLink,
      waSent,
      response: responseData,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Dispatch failed' }, { status: 200 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/sendEmail';

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

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*, customers(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const { data: s } = await supabaseAdmin
      .from('store_settings')
      .select('*')
      .single();

    if (!s?.postex_enabled || !s?.postex_api_token) {
      return NextResponse.json({ success: false, error: 'PostEx is not configured.' }, { status: 200 });
    }

    const baseUrl = s.postex_mode === 'production' ? POSTEX_BASE : POSTEX_STAGING;
    const token = s.postex_api_token;

    const customerName = order.customer_name || order.customers?.name || '';
    const customerPhone = cleanPhone(order.customer_phone || order.customers?.phone || '');
    const customerEmail = order.customer_email || order.customers?.email || '';
    const orderItems = Array.isArray(order.items) ? order.items : [];
    const firstItem = orderItems[0] || {};
    const itemName = firstItem.name || 'Order items';
    const itemSku = firstItem.sku || '';

    const deliveryDetail = (s.postex_product_check || '1') === '1'
      ? itemName
      : (s.postex_default_product || 'Kids Clothes');

    let finalWeight = parseFloat(String(weight)) || parseFloat(s.postex_default_weight) || 0.5;
    if ((s.postex_weight_check || '1') !== '1') {
      finalWeight = parseFloat(s.postex_default_weight) || 0.5;
    }

    let finalItems = parseInt(String(packetCount)) || parseInt(s.postex_default_items) || 1;
    if ((s.postex_pieces_check || '1') !== '1') {
      finalItems = parseInt(s.postex_default_items) || 1;
    }

    let totalAmount = parseFloat(order.total) || 0;
    if ((s.postex_cod_check || '0') === '1') {
      const searchText = `${remarks || ''} ${itemName} ${order.notes || ''}`.toLowerCase();
      if (searchText.includes('paid') || searchText.includes('prepaid') || searchText.includes('non-cod') || searchText.includes('non cod')) {
        totalAmount = 0;
      }
    }

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

    if (!returnCity) returnCity = 'KARACHI';
    if (pickupCode === '5450') pickupCode = '54500';
    if (returnCode === '5450') returnCode = '54500';

    const normPickup = pickupText.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const normReturn = returnText.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (normPickup === normReturn && pickupCode) {
      returnCode = pickupCode;
    }

    let orderDetail = deliveryDetail;
    if ((s.postex_sku_check || '0') === '1' && itemSku) {
      orderDetail = `${deliveryDetail} (${itemSku})`;
    }

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
      headers: { token, 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseData = await res.json();

    if (res.status !== 200 && res.status !== 201) {
      const msg = responseData.statusMessage || responseData.message || responseData.error || `PostEx API error (${res.status})`;
      return NextResponse.json({ success: false, error: msg, details: responseData }, { status: 200 });
    }

    const trackingNumber = responseData.dist?.trackingNumber || responseData.data?.trackingNumber || responseData.trackingNumber || responseData.data?.cn || responseData.cn || responseData.data?.awbNumber || responseData.awbNumber || '';
    const trackingUrl = trackingNumber
      ? `https://postex.pk/tracking?cn=${trackingNumber}`
      : '';

    // ── Build combined status_logs + WhatsApp ──────────────────────────────
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

    let waLink = '';
    if (waPhone && s.postex_whatsapp_template) {
      try {
        waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;
      } catch (waErr) {
        console.error('[PostEx Fulfill] WhatsApp link generation failed:', waErr);
      }
    }

    // Single update with both booking and WhatsApp logs
    const existingLogs = Array.isArray(order.status_logs) ? order.status_logs : [];
    const combinedLogs = [
      ...existingLogs,
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'status_change' as const,
        message: `Order has been booked at PostEx with Tracking # ${trackingNumber}`,
        status: 'shipped',
        createdAt: new Date().toISOString(),
      },
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'whatsapp_notification' as const,
        message: `Order has been booked at PostEx with Tracking # ${trackingNumber}. WhatsApp alert ready for ${waPhone || 'N/A'}`,
        waLink,
        status: 'shipped',
        createdAt: new Date().toISOString(),
      },
    ];

    await supabaseAdmin
      .from('orders')
      .update({
        status: 'shipped',
        tracking_number: trackingNumber,
        courier_name: 'PostEx',
        tracking_url: trackingUrl,
        status_logs: combinedLogs,
      })
      .eq('id', orderId);

    // ── Email Notification (Courier Link + CN) ────────────────────────────
    const storeName = s.store_name || 'Zaynahs E-Store';
    const storeUrl = s.store_url || '';

    const emailSubject = `Your order has been shipped via PostEx — Tracking: ${trackingNumber}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a2e; font-size: 24px;">${storeName}</h1>
        </div>
        <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; border: 1px solid #e5e5e5;">
          <h2 style="color: #1a1a2e; font-size: 18px; margin-top: 0;">Your order has been dispatched!</h2>
          <p style="color: #555; line-height: 1.6;">Hi ${customerName},</p>
          <p style="color: #555; line-height: 1.6;">Your order (${order.order_number || orderId.slice(0, 8)}) has been handed over to <strong>PostEx Logistics</strong> and is on its way.</p>
          <div style="background: #fff; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center; border: 1px solid #e5e5e5;">
            <p style="margin: 0 0 8px; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Tracking Consignment Number</p>
            <p style="margin: 0 0 16px; font-size: 22px; font-weight: bold; color: #1a1a2e; letter-spacing: 2px;">${trackingNumber}</p>
            <a href="${trackingUrl}" target="_blank" style="display: inline-block; background: #e94560; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px;">Track Your Parcel →</a>
          </div>
          ${finalRemarks ? `<p style="color: #555; line-height: 1.6;"><strong>Note:</strong> ${finalRemarks}</p>` : ''}
        </div>
        <div style="text-align: center; margin-top: 24px; color: #999; font-size: 12px;">
          <p>${storeName} | ${storeUrl ? `<a href="${storeUrl}" style="color: #e94560;">${storeUrl}</a>` : ''}</p>
        </div>
      </div>
    `;

    // Send to customer if email exists
    if (customerEmail) {
      try {
        await sendEmail({ to: customerEmail, subject: emailSubject, html: emailHtml });
        console.log(`[PostEx Fulfill] Shipped email sent to customer: ${customerEmail}`);
      } catch (mailErr) {
        console.error('[PostEx Fulfill] Failed to send email to customer:', mailErr);
      }
    }

    // Send to admin/store email as well
    try {
      const adminEmail = s.smtp_email || '';
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `[${storeName}] Order dispatched — ${trackingNumber}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a1a2e;">Order Fulfilled via PostEx</h2>
              <p><strong>Order:</strong> ${order.order_number || orderId}</p>
              <p><strong>Customer:</strong> ${customerName} (${customerPhone})</p>
              <p><strong>Tracking CN:</strong> ${trackingNumber}</p>
              <p><strong>Tracking Link:</strong> <a href="${trackingUrl}">${trackingUrl}</a></p>
              <p><strong>Courier:</strong> PostEx Logistics</p>
              ${customerEmail ? `<p><strong>Customer Email:</strong> ${customerEmail}</p>` : ''}
              <p><strong>COD Amount:</strong> PKR ${totalAmount}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
              <p style="color: #888;">This is an automated fulfillment notification from ${storeName}.</p>
            </div>
          `,
        });
        console.log(`[PostEx Fulfill] Shipped notification sent to admin: ${adminEmail}`);
      }
    } catch (adminMailErr) {
      console.error('[PostEx Fulfill] Failed to send email to admin:', adminMailErr);
    }

    return NextResponse.json({
      success: true,
      trackingNumber,
      trackingUrl,
      courierName: 'PostEx',
      waLink,
      response: responseData,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Fulfillment failed' }, { status: 200 });
  }
}

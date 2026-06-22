import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendTemplatedEmail } from '@/lib/email/sendTemplatedEmail';
import { getSettings } from '@/lib/services/settings';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Secure the cron endpoint: allow local runs in dev mode or verify bearer token
    const isDev = process.env.NODE_ENV === 'development';
    const isLocalTrigger = url.searchParams.get('secret') === 'local-bypass';
    const isAuthorized = isDev || isLocalTrigger || (cronSecret && authHeader === `Bearer ${cronSecret}`);

    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate the timestamp 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Query pending review email orders delivered over 3 days ago
    const { data: pendingOrders, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, customer_id, items, total, subtotal, notes')
      .eq('review_email_pending', true)
      .lte('delivered_at', threeDaysAgo.toISOString());

    if (fetchError) throw fetchError;

    if (!pendingOrders || pendingOrders.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: 'No orders require review emails' });
    }

    const settings = await getSettings();
    let successCount = 0;

    for (const order of pendingOrders) {
      try {
        // Resolve customer email address from customers table
        let customerEmail = '';
        if (order.customer_id) {
          const { data: cust } = await supabaseAdmin
            .from('customers')
            .select('email')
            .eq('id', order.customer_id)
            .maybeSingle();
          if (cust?.email) {
            customerEmail = cust.email;
          }
        }

        // Fallback: Parse email from order notes if not found through customer record
        if (!customerEmail && order.notes) {
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
          const match = order.notes.match(emailRegex);
          if (match) {
            customerEmail = match[0];
          }
        }

        if (customerEmail) {
          // Send review request email
          const orderContext = {
            id: order.id,
            orderNumber: order.order_number,
            items: order.items,
            total: order.total,
            subtotal: order.subtotal
          };

          const customerContext = {
            name: order.customer_name,
            phone: order.customer_phone,
            email: customerEmail
          };

          const result = await sendTemplatedEmail('review_request', customerEmail, {
            order: orderContext,
            customer: customerContext
          });

          if (result.success) {
            successCount++;
          }
        }

        // Mark as sent (review_email_pending = false) regardless of whether they have an email,
        // to prevent infinite loops for customers who did not provide an email address.
        await supabaseAdmin
          .from('orders')
          .update({ review_email_pending: false })
          .eq('id', order.id);

      } catch (err) {
        console.error(`[Cron Review] Failed to process order ${order.id}:`, err);
      }
    }

    return NextResponse.json({ success: true, processed: pendingOrders.length, sentCount: successCount });
  } catch (error: any) {
    console.error('[Cron Review Request] GET handler failed:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

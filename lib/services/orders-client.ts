import { createClient } from '@/lib/supabase/client';
import { Order, CartItem, StatusLogItem } from '@/lib/types';

export const getOrdersClient = async (): Promise<Order[]> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data ?? []).map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      customerName: row.customer_name || undefined,
      customerPhone: row.customer_phone || undefined,
      customerId: row.customer_id || undefined,
      items: (row.items || []) as CartItem[],
      subtotal: row.subtotal ? parseFloat(row.subtotal.toString()) : 0,
      total: row.total ? parseFloat(row.total.toString()) : 0,
      status: row.status as Order['status'],
      notes: row.notes || undefined,
      staffNotes: row.staff_notes || undefined,
      statusLogs: (row.status_logs || []) as StatusLogItem[],
      reviewEmailPending: row.review_email_pending ?? false,
      deliveredAt: row.delivered_at || undefined,
      trackingNumber: row.tracking_number || undefined,
      courierName: row.courier_name || undefined,
      trackingUrl: row.tracking_url || undefined,
      cancelReason: row.cancel_reason || undefined,
      refundAmount: row.refund_amount ? parseFloat(row.refund_amount.toString()) : undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error('[orders-client] getOrdersClient failed:', error);
    throw error;
  }
};

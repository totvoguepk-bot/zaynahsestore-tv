'use server';

import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { 
  hashPassword, 
  verifyPassword, 
  setCustomerSessionCookie, 
  clearCustomerSessionCookie,
  getCustomerSession
} from '@/lib/utils/customer-auth';
import { Order } from '@/lib/types';

interface OrderRow {
  id: string;
  order_number: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  items?: unknown;
  subtotal?: string | number | null;
  total?: string | number | null;
  status: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

const mapOrder = (row: OrderRow): Order => ({
  id: row.id,
  orderNumber: row.order_number,
  customerName: row.customer_name || undefined,
  customerPhone: row.customer_phone || undefined,
  items: (row.items || []) as any[],
  subtotal: row.subtotal ? parseFloat(row.subtotal.toString()) : 0,
  total: row.total ? parseFloat(row.total.toString()) : 0,
  status: row.status as Order['status'],
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

/**
 * Normalizes phone numbers for matching
 */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Links previous orders to this customer based on phone matching
 */
async function linkPreviousOrders(customerId: string, phone: string | null) {
  if (!phone) return;
  try {
    const cleanPhone = normalizePhone(phone);
    if (cleanPhone.length < 7) return;

    // Fetch all orders that don't have a customer_id yet
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('id, customer_phone')
      .is('customer_id', null);

    if (error || !orders) return;

    const matchingOrderIds = orders
      .filter(order => {
        if (!order.customer_phone) return false;
        const oPhone = normalizePhone(order.customer_phone);
        return oPhone.endsWith(cleanPhone) || cleanPhone.endsWith(oPhone);
      })
      .map(order => order.id);

    if (matchingOrderIds.length > 0) {
      await supabaseAdmin
        .from('orders')
        .update({ customer_id: customerId })
        .in('id', matchingOrderIds);
    }
  } catch (err) {
    console.error('Failed to link previous orders:', err);
  }
}

/**
 * Customer signup action
 */
export async function customerSignup(data: {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
}) {
  try {
    const email = data.email?.trim() || null;
    const phone = data.phone?.trim() || null;
    const name = data.name.trim();
    const password = data.password;

    if (!email && !phone) {
      return { success: false, error: 'Please enter either an email or a phone number.' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Check if customer already exists
    let existingCustomer: any = null;

    if (email) {
      const { data } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (data) existingCustomer = data;
    }

    if (!existingCustomer && phone) {
      const { data } = await supabaseAdmin
        .from('customers')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();
      if (data) existingCustomer = data;
    }

    if (existingCustomer) {
      // If customer has a password_hash already, they are already registered
      if (existingCustomer.password_hash) {
        return { 
          success: false, 
          error: `An account with this ${existingCustomer.email === email ? 'email' : 'phone number'} already exists. Please log in instead.` 
        };
      }

      // If they don't have a password_hash, they were created as a guest during checkout.
      // We can update the record with their name and password to claim the account!
      const { data: customer, error } = await supabaseAdmin
        .from('customers')
        .update({
          name,
          email: email || existingCustomer.email,
          phone: phone || existingCustomer.phone,
          password_hash: passwordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCustomer.id)
        .select('*')
        .single();

      if (error || !customer) {
        throw error || new Error('Signup failed to update guest account');
      }

      // Auto-link old orders
      await linkPreviousOrders(customer.id, phone);

      // Set cookie session
      await setCustomerSessionCookie({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      });

      if (customer.email) {
        try {
          const { onUserRegister } = await import('@/lib/email/triggers');
          await onUserRegister({ name: customer.name, email: customer.email });
        } catch (err) {
          console.error('[Email Trigger] failed in customerSignup update:', err);
        }
      }

      return { success: true, customer };
    }

    // No existing customer, create a new one
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .insert({
        name,
        email,
        phone,
        password_hash: passwordHash
      })
      .select('*')
      .single();

    if (error || !customer) {
      throw error || new Error('Signup failed');
    }

    // Auto-link old orders
    await linkPreviousOrders(customer.id, phone);

    // Set cookie session
    await setCustomerSessionCookie({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    });

    if (customer.email) {
      try {
        const { onUserRegister } = await import('@/lib/email/triggers');
        await onUserRegister({ name: customer.name, email: customer.email });
      } catch (err) {
        console.error('[Email Trigger] failed in customerSignup insert:', err);
      }
    }

    return { success: true, customer };
  } catch (err) {
    console.error('customerSignup failed:', err);
    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}

/**
 * Customer login action
 */
export async function customerLogin(data: {
  emailOrPhone: string;
  password?: string;
}) {
  try {
    const credential = data.emailOrPhone.trim();
    const password = data.password;

    if (!credential || !password) {
      return { success: false, error: 'Credentials are required.' };
    }

    // Query customer by email or phone
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .or(`email.eq.${credential},phone.eq.${credential}`)
      .maybeSingle();

    if (error || !customer) {
      return { success: false, error: 'Invalid email, phone number, or password.' };
    }

    // Verify password hash
    const isValid = verifyPassword(password, customer.password_hash);
    if (!isValid) {
      return { success: false, error: 'Invalid email, phone number, or password.' };
    }

    // Auto-link old orders in case any new ones appeared or weren't linked
    await linkPreviousOrders(customer.id, customer.phone);

    // Set cookie session
    await setCustomerSessionCookie({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone
    });

    return { success: true, customer };
  } catch (err) {
    console.error('customerLogin failed:', err);
    return { success: false, error: 'An error occurred during login.' };
  }
}

/**
 * Customer logout action
 */
export async function customerLogout() {
  await clearCustomerSessionCookie();
  return { success: true };
}

/**
 * Fetch customer profile
 */
export async function getCustomerProfile() {
  const session = await getCustomerSession();
  if (!session) return null;
  return session;
}

/**
 * Fetch orders for the currently logged-in customer
 */
export async function getCustomerOrders(): Promise<Order[]> {
  try {
    const session = await getCustomerSession();
    if (!session) return [];

    const supabase = await createClient();
    
    // Fetch orders matching customer_id, OR matching customer's phone if customer_id was missed
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (session.phone) {
      query = query.or(`customer_id.eq.${session.id},customer_phone.eq.${session.phone}`);
    } else {
      query = query.eq('customer_id', session.id);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data ?? []).map(mapOrder);
  } catch (err) {
    console.error('getCustomerOrders failed:', err);
    return [];
  }
}

/**
 * Get all customers for the admin portal dashboard
 */
export async function getAdminCustomers() {
  try {
    const supabase = await createClient();
    
    // Select all customers, along with their orders
    const { data, error } = await supabase
      .from('customers')
      .select('*, orders(id, total, status)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((c: any) => {
      const orders = c.orders || [];
      const totalSpent = orders
        .filter((o: any) => o.status !== 'cancelled')
        .reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email || null,
        phone: c.phone || null,
        createdAt: c.created_at,
        ordersCount: orders.length,
        totalSpent
      };
    });
  } catch (err) {
    console.error('getAdminCustomers failed:', err);
    return [];
  }
}

/**
 * Changes password of currently logged in customer
 */
export async function changeCustomerPassword(data: {
  currentPassword?: string;
  newPassword?: string;
}) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return { success: false, error: 'You must be logged in to change your password.' };
    }

    const currentPassword = data.currentPassword;
    const newPassword = data.newPassword;

    if (!currentPassword || !newPassword) {
      return { success: false, error: 'Current password and new password are required.' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    // Fetch customer record
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', session.id)
      .single();

    if (error || !customer) {
      return { success: false, error: 'Customer account not found.' };
    }

    // Verify current password
    const isValid = verifyPassword(currentPassword, customer.password_hash);
    if (!isValid) {
      return { success: false, error: 'The current password you entered is incorrect.' };
    }

    // Hash and update new password
    const passwordHash = hashPassword(newPassword);
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.id);

    if (updateError) {
      throw updateError;
    }

    return { success: true };
  } catch (err) {
    console.error('changeCustomerPassword failed:', err);
    return { success: false, error: 'Failed to change password. Please try again.' };
  }
}

export async function getDeletedCustomers() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*, orders(id, total, status)')
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((c: any) => {
      const orders = c.orders || [];
      const totalSpent = orders
        .filter((o: any) => o.status !== 'cancelled')
        .reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

      return {
        id: c.id,
        name: c.name,
        email: c.email || null,
        phone: c.phone || null,
        createdAt: c.created_at,
        deletedAt: c.deleted_at,
        ordersCount: orders.length,
        totalSpent
      };
    });
  } catch (err) {
    console.error('getDeletedCustomers failed:', err);
    return [];
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('customers')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('deleteCustomer failed:', error);
    throw error;
  }
}

export async function restoreCustomer(id: string): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('customers')
      .update({ deleted_at: null })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('restoreCustomer failed:', error);
    throw error;
  }
}

export async function hardDeleteCustomer(id: string): Promise<void> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('hardDeleteCustomer failed:', error);
    throw error;
  }
}

/**
 * Request customer password reset email
 */
export async function requestCustomerPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return { success: false, error: 'Email address is required.' };
    }

    // 1. Fetch customer by email
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .select('id, name, email')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (error) {
      console.error('[requestCustomerPasswordReset] failed to query customer:', error);
      return { success: false, error: 'Database error occurred.' };
    }

    if (!customer || !customer.email) {
      // Return success anyway for security reasons (don't leak registered emails)
      return { success: true };
    }

    // 2. Generate secure token & expiry
    const crypto = await import('crypto');
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

    // 3. Save to database
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        reset_token: token,
        reset_token_expires_at: expiresAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', customer.id);

    if (updateError) {
      console.error('[requestCustomerPasswordReset] failed to update reset token:', updateError);
      return { success: false, error: 'Failed to generate reset link.' };
    }

    // 4. Send email
    try {
      const { onPasswordResetRequest } = await import('@/lib/email/triggers');
      await onPasswordResetRequest({ name: customer.name, email: customer.email }, token);
    } catch (emailErr) {
      console.error('[requestCustomerPasswordReset] failed to dispatch reset email:', emailErr);
      return { success: false, error: 'Reset link generated, but email delivery failed.' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[requestCustomerPasswordReset] general error:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

/**
 * Reset customer password using verified token
 */
export async function resetCustomerPasswordWithToken(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!token) {
      return { success: false, error: 'Reset token is missing or invalid.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // 1. Fetch customer by reset token
    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('reset_token', token)
      .maybeSingle();

    if (error || !customer) {
      return { success: false, error: 'Invalid or expired password reset link.' };
    }

    // 2. Verify token expiry
    if (!customer.reset_token_expires_at || new Date(customer.reset_token_expires_at) < new Date()) {
      return { success: false, error: 'Password reset link has expired. Please request a new one.' };
    }

    // 3. Hash and update new password
    const passwordHash = hashPassword(newPassword);
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({
        password_hash: passwordHash,
        reset_token: null,
        reset_token_expires_at: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', customer.id);

    if (updateError) {
      console.error('[resetCustomerPasswordWithToken] failed to update password:', updateError);
      return { success: false, error: 'Failed to update password.' };
    }

    // 4. Send confirmation email
    if (customer.email) {
      try {
        const { onPasswordChanged } = await import('@/lib/email/triggers');
        await onPasswordChanged({ name: customer.name, email: customer.email });
      } catch (emailErr) {
        console.error('[resetCustomerPasswordWithToken] failed to dispatch success email:', emailErr);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('[resetCustomerPasswordWithToken] general error:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}


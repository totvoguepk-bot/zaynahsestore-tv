'use server';

import { createClient } from '@/lib/supabase/server';
import { PaymentMethod } from '@/lib/types';
import { revalidateTag } from 'next/cache';

export async function getPaymentMethods(onlyActive = false): Promise<PaymentMethod[]> {
  const supabase = await createClient();
  let query = supabase
    .from('payment_methods')
    .select('*')
    .order('created_at', { ascending: true });

  if (onlyActive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('getPaymentMethods failed:', error);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    code: row.code,
    active: row.active,
    instructions: row.instructions,
    createdAt: row.created_at
  }));
}

export async function createPaymentMethod(data: {
  name: string;
  code: string;
  active?: boolean;
  instructions?: string;
}): Promise<PaymentMethod> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from('payment_methods')
    .insert([{
      name: data.name,
      code: data.code.toLowerCase().trim(),
      active: data.active ?? true,
      instructions: data.instructions
    }])
    .select()
    .single();

  if (error) {
    console.error('createPaymentMethod failed:', error);
    throw error;
  }

  (revalidateTag as any)('payment_methods');
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    active: row.active,
    instructions: row.instructions,
    createdAt: row.created_at
  };
}

export async function updatePaymentMethod(
  id: string,
  data: Partial<Omit<PaymentMethod, 'id' | 'createdAt'>>
): Promise<PaymentMethod> {
  const supabase = await createClient();

  const updatePayload: any = {};
  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.code !== undefined) updatePayload.code = data.code.toLowerCase().trim();
  if (data.active !== undefined) updatePayload.active = data.active;
  if (data.instructions !== undefined) updatePayload.instructions = data.instructions;

  const { data: row, error } = await supabase
    .from('payment_methods')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updatePaymentMethod failed:', error);
    throw error;
  }

  (revalidateTag as any)('payment_methods');
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    active: row.active,
    instructions: row.instructions,
    createdAt: row.created_at
  };
}

export async function deletePaymentMethod(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deletePaymentMethod failed:', error);
    throw error;
  }

  (revalidateTag as any)('payment_methods');
}

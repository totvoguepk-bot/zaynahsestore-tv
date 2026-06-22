'use server';

import { createClient } from '@/lib/supabase/server';
import { ShippingMethod } from '@/lib/types';
import { revalidateTag } from 'next/cache';

export async function getShippingMethods(onlyActive = false): Promise<ShippingMethod[]> {
  const supabase = await createClient();
  let query = supabase
    .from('shipping_methods')
    .select('*')
    .order('cost', { ascending: true });

  if (onlyActive) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;
  if (error) {
    console.error('getShippingMethods failed:', error);
    throw error;
  }

  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    cost: Number(row.cost),
    estimatedDays: row.estimated_days,
    active: row.active,
    createdAt: row.created_at
  }));
}

export async function createShippingMethod(data: {
  name: string;
  cost: number;
  estimatedDays?: string;
  active?: boolean;
}): Promise<ShippingMethod> {
  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from('shipping_methods')
    .insert([{
      name: data.name,
      cost: data.cost,
      estimated_days: data.estimatedDays,
      active: data.active ?? true
    }])
    .select()
    .single();

  if (error) {
    console.error('createShippingMethod failed:', error);
    throw error;
  }

  (revalidateTag as any)('shipping_methods');
  return {
    id: row.id,
    name: row.name,
    cost: Number(row.cost),
    estimatedDays: row.estimated_days,
    active: row.active,
    createdAt: row.created_at
  };
}

export async function updateShippingMethod(
  id: string,
  data: Partial<Omit<ShippingMethod, 'id' | 'createdAt'>>
): Promise<ShippingMethod> {
  const supabase = await createClient();
  
  const updatePayload: any = {};
  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.cost !== undefined) updatePayload.cost = data.cost;
  if (data.estimatedDays !== undefined) updatePayload.estimated_days = data.estimatedDays;
  if (data.active !== undefined) updatePayload.active = data.active;

  const { data: row, error } = await supabase
    .from('shipping_methods')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateShippingMethod failed:', error);
    throw error;
  }

  (revalidateTag as any)('shipping_methods');
  return {
    id: row.id,
    name: row.name,
    cost: Number(row.cost),
    estimatedDays: row.estimated_days,
    active: row.active,
    createdAt: row.created_at
  };
}

export async function deleteShippingMethod(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('shipping_methods')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deleteShippingMethod failed:', error);
    throw error;
  }

  (revalidateTag as any)('shipping_methods');
}

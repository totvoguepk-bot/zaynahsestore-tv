// ⚠️ CLIENT-SIDE ONLY — uses browser Supabase client (safe for 'use client' components)
import { createClient } from '@/lib/supabase/client';
import { WhatsAppSubscriber, EmailSubscriber } from '@/lib/types';

export const addWhatsAppSubscriberClient = async (
  phone: string,
  name?: string,
  email?: string,
  source_type?: string
): Promise<WhatsAppSubscriber> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('whatsapp_subscribers')
    .insert({ phone, name, email, source_type })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      const { data: existing } = await supabase
        .from('whatsapp_subscribers')
        .select('*')
        .eq('phone', phone)
        .single();
      if (existing) return existing;
    }
    throw error;
  }
  return data;
};

export const addEmailSubscriberClient = async (email: string): Promise<EmailSubscriber> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('email_subscribers')
    .insert({ email, source: 'newsletter' })
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') {
      const { data: existing } = await supabase
        .from('email_subscribers')
        .select('*')
        .eq('email', email)
        .single();
      if (existing) return existing;
    }
    throw error;
  }
  return data;
};

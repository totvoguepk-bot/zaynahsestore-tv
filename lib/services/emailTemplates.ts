import { supabaseAdmin } from '@/lib/supabase/admin';
import { EmailTemplate } from '@/lib/types';
import { revalidateTag } from 'next/cache';

const mapTemplate = (row: any): EmailTemplate => ({
  id: row.id,
  emailType: row.email_type,
  category: row.category,
  label: row.label,
  description: row.description || undefined,
  enabled: row.enabled ?? true,
  subject: row.subject,
  customHtml: row.custom_html || undefined,
  updatedAt: row.updated_at
});

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .order('category', { ascending: false })
      .order('label', { ascending: true });

    if (error) throw error;
    return (data ?? []).map(mapTemplate);
  } catch (error) {
    console.error('[emailTemplates] getEmailTemplates failed:', error);
    throw error;
  }
};

export const getEmailTemplate = async (emailType: string): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .select('*')
      .eq('email_type', emailType)
      .maybeSingle();

    if (error) throw error;
    return data ? mapTemplate(data) : null;
  } catch (error) {
    console.error(`[emailTemplates] getEmailTemplate(${emailType}) failed:`, error);
    throw error;
  }
};

export const updateEmailTemplate = async (
  emailType: string,
  updates: Partial<Omit<EmailTemplate, 'id' | 'emailType' | 'category' | 'label' | 'description' | 'updatedAt'>>
): Promise<EmailTemplate> => {
  try {
    const payload: any = {};
    if (updates.subject !== undefined) payload.subject = updates.subject;
    if (updates.customHtml !== undefined) payload.custom_html = updates.customHtml;
    if (updates.enabled !== undefined) payload.enabled = updates.enabled;
    payload.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .update(payload)
      .eq('email_type', emailType)
      .select('*')
      .single();

    if (error) throw error;
    (revalidateTag as any)('email-templates');
    return mapTemplate(data);
  } catch (error) {
    console.error(`[emailTemplates] updateEmailTemplate(${emailType}) failed:`, error);
    throw error;
  }
};

export const resetEmailTemplate = async (emailType: string): Promise<EmailTemplate> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('email_templates')
      .update({ custom_html: null, updated_at: new Date().toISOString() })
      .eq('email_type', emailType)
      .select('*')
      .single();

    if (error) throw error;
    (revalidateTag as any)('email-templates');
    return mapTemplate(data);
  } catch (error) {
    console.error(`[emailTemplates] resetEmailTemplate(${emailType}) failed:`, error);
    throw error;
  }
};

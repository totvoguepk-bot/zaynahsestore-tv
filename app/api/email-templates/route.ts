import { NextResponse } from 'next/server';
import { getEmailTemplates } from '@/lib/services/emailTemplates';

export async function GET() {
  try {
    const templates = await getEmailTemplates();
    
    // Group templates by category
    const grouped = templates.reduce((acc, template) => {
      const cat = template.category;
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(template);
      return acc;
    }, {} as Record<string, typeof templates>);

    return NextResponse.json({ success: true, templates: grouped });
  } catch (error: any) {
    console.error('[API email-templates] GET failed:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}

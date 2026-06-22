import { NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/services/settings';

export const revalidate = 0; // Disable dynamic caching for this API route

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({
      theme_preset: settings.theme_preset || 'classic_white',
      theme_config: settings.theme_config || null,
    });
  } catch (error: any) {
    console.error('[API Theme GET] failed:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { theme_preset, theme_config } = body;
    
    if (!theme_preset) {
      return NextResponse.json({ error: 'theme_preset is required' }, { status: 400 });
    }
    
    const updated = await updateSettings({
      theme_preset,
      theme_config,
    });
    
    return NextResponse.json({
      success: true,
      theme_preset: updated.theme_preset,
      theme_config: updated.theme_config,
    });
  } catch (error: any) {
    console.error('[API Theme POST] failed:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

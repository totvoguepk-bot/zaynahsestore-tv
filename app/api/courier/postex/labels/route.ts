import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cns = searchParams.get('cns') || '';

  const trackingNumbers = cns.split(',').filter(Boolean);

  const lines = trackingNumbers.map((cn, i) => {
    const n = i + 1;
    return [
      `╔══════════════════════════════════════════╗`,
      `║            POSTEX SHIPPING LABEL          ║`,
      `║              Tracking # ${cn.padEnd(14)}║`,
      `║  https://postex.pk/tracking?cn=${cn.padEnd(16)}║`,
      `╚══════════════════════════════════════════╝`,
      '',
    ].join('\n');
  });

  const content = [
    '═══════════════════════════════════════════════════════════════',
    '                     POSTEX BOOKING LABELS                     ',
    `  Generated: ${new Date().toLocaleString('en-GB')}`,
    `  Total Labels: ${trackingNumbers.length}`,
    '═══════════════════════════════════════════════════════════════',
    '',
    ...lines,
    '───────────────────────────────────────────────────────────────',
    '  These labels can be printed and affixed to packages.',
    '───────────────────────────────────────────────────────────────',
  ].join('\n');

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="postex-labels-${Date.now()}.txt"`,
    },
  });
}

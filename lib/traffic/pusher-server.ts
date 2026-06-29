// Server-side Pusher — only loaded when env vars are present
// Uses dynamic import to avoid blocking if Pusher is not configured

let pusherInstance: any = null;

function getPusher() {
  if (pusherInstance) return pusherInstance;
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;
  if (!appId || !key || !secret || !cluster) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Pusher = require('pusher');
    pusherInstance = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });
    console.log('[pusher] Initialized');
    return pusherInstance;
  } catch (err) {
    console.error('[pusher] Failed to initialize:', err);
    return null;
  }
}

export function triggerTrafficUpdate(data: {
  liveCount: number;
  totalVisitors: number;
  totalPageviews: number;
}) {
  const pusher = getPusher();
  if (!pusher) return;
  pusher.trigger('traffic-channel', 'traffic-update', data).catch((err: Error) => {
    console.error('[pusher] Trigger failed:', err);
  });
}

export function triggerVisitorActive(city: string, country: string) {
  const pusher = getPusher();
  if (!pusher) return;
  pusher.trigger('traffic-channel', 'visitor-active', { city, country, timestamp: Date.now() }).catch((err: Error) => {
    console.error('[pusher] Visitor trigger failed:', err);
  });
}

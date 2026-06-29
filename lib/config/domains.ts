export function getDomainName(hostOrUrl: string): string {
  let host = hostOrUrl;

  try {
    if (host.startsWith('http')) {
      host = new URL(host).hostname;
    }
  } catch {}

  host = host.replace(/:\d+$/, '').replace(/^www\./, '').toLowerCase();

  const parts = host.split('.');
  let mainPart: string;
  if (parts.length >= 2) {
    mainPart = parts[parts.length - 2];
  } else {
    mainPart = parts[0];
  }

  const words = mainPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (parts.length >= 2) {
    const tld = parts.slice(parts.length - 1)[0];
    return words + '.' + tld;
  }

  return words || 'Store';
}

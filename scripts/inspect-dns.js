// scripts/inspect-dns.js
const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

if (!zoneId || !apiToken) {
  console.error('Error: CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_TOKEN missing');
  process.exit(1);
}

async function inspectDNS() {
  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await res.json();
  if (!data.success) {
    console.error('Error fetching DNS records:', data.errors);
    process.exit(1);
  }
  
  console.log('DNS Records:');
  data.result.forEach(r => {
    console.log(`- ID: ${r.id}, Name: ${r.name}, Type: ${r.type}, Content: ${r.content}`);
  });
}

inspectDNS();

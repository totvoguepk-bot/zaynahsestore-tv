// scripts/list-zones.js
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

if (!apiToken) {
  console.error('Error: CLOUDFLARE_API_TOKEN missing');
  process.exit(1);
}

async function listZones() {
  const url = `https://api.cloudflare.com/client/v4/zones`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await res.json();
  if (!data.success) {
    console.error('Error fetching zones:', data.errors);
    process.exit(1);
  }
  
  console.log('Zones:');
  data.result.forEach(z => {
    console.log(`- ID: ${z.id}, Name: ${z.name}, Status: ${z.status}`);
  });
}

listZones();

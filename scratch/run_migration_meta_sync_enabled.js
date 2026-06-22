const fs = require('fs');
const { Client } = require('/Users/shoaib/Desktop/Zaynahs e-store/node_modules/pg');

const envPath = '/Users/shoaib/Desktop/Zaynahs e-store/.env.local';
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
  console.error('Failed to read .env.local:', e);
  process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  }
});

const directUrl = env.DIRECT_URL;
if (!directUrl) {
  console.error('Missing DIRECT_URL in .env.local');
  process.exit(1);
}

console.log('Connecting to database...');
const client = new Client({
  connectionString: directUrl,
});

async function run() {
  await client.connect();
  console.log('Connected. Running migration SQL...');
  try {
    const sql = `
      ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS meta_sync_enabled BOOLEAN DEFAULT false;
    `;
    const res = await client.query(sql);
    console.log('Migration executed successfully:', res);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

run();

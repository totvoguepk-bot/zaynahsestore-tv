const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkNav() {
  const { data: settings } = await supabase.from('store_settings').select('*').single();
  console.log('Navigation Menu from DB:');
  console.log(JSON.stringify(settings.navigation_menu || settings.navigationMenu, null, 2));

  const { data: categories } = await supabase.from('categories').select('*');
  console.log('Categories from DB:');
  console.log(JSON.stringify(categories, null, 2));
}

checkNav();

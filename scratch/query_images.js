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
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function queryData() {
  console.log('Querying products...');
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name, slug, active, product_images(*)');
  
  if (pError) {
    console.error('Error fetching products:', pError);
  } else {
    console.log(`Found ${products.length} products.`);
    products.forEach(p => {
      if (p.product_images && p.product_images.length > 0) {
        console.log(`Product: ${p.name} (${p.slug}), Active: ${p.active}`);
        p.product_images.forEach(img => {
          console.log(`  - Image URL: ${img.url}`);
        });
      }
    });
  }

  console.log('Querying homepage sections...');
  const { data: sections, error: sError } = await supabase
    .from('homepage_sections')
    .select('*');
  
  if (sError) {
    console.log('Error fetching sections:', sError);
  } else if (sections) {
    console.log(`Found ${sections.length} homepage sections.`);
    sections.forEach(s => {
      console.log(`Section: ${s.title} (${s.section_type}), Active: ${s.active}`);
      console.log('  Settings:', JSON.stringify(s.settings));
      console.log('  Content Data:', JSON.stringify(s.content_data));
    });
  }
}

queryData();

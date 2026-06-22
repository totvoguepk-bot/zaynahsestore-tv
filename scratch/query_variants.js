const { Client } = require('pg');
const connectionString = "postgresql://postgres.ziucrfpebpxijqhwmqre:SgctHbxOSeqSkCYg@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

const run = async () => {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to DB!");
  
  const res = await client.query(`
    SELECT enable_variant_swatches, card_show_swatches, card_show_sizes, card_show_materials, card_show_custom
    FROM public.store_settings;
  `);
  
  console.log("Settings:");
  console.log(JSON.stringify(res.rows, null, 2));
  
  await client.end();
};

run().catch(err => {
  console.error("Failed:", err);
  process.exit(1);
});

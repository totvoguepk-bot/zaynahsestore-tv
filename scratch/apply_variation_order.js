const { Client } = require('pg');
const connectionString = "postgresql://postgres.ziucrfpebpxijqhwmqre:SgctHbxOSeqSkCYg@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

const run = async () => {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to DB!");
  
  const query = `
    ALTER TABLE public.products 
    ADD COLUMN IF NOT EXISTS variation_order TEXT[] DEFAULT NULL;
  `;
  
  console.log("Executing migration...");
  await client.query(query);
  console.log("Migration successful!");
  
  await client.end();
};

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});

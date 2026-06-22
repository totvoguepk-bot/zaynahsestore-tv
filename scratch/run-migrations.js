const { Client } = require('pg');
const connectionString = "postgresql://postgres.ziucrfpebpxijqhwmqre:SgctHbxOSeqSkCYg@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

const run = async () => {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to DB!");
  
  const queries = [
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`,
    `ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`,
    `ALTER TABLE public.media_library ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`,
    `ALTER TABLE public.whatsapp_subscribers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`,
    `ALTER TABLE public.email_subscribers ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;`
  ];
  
  for (const q of queries) {
    console.log("Executing:", q);
    await client.query(q);
  }
  
  console.log("Migration successful!");
  await client.end();
};

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});

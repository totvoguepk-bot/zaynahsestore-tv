/**
 * Check that ALL migrations are fully reflected in SUPER_MASTER_SCHEMA.sql
 * Usage: node scripts/check-master-schema.mjs
 * Returns exit code 0 if OK, 1 if issues found.
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCHEMA_FILE = join(ROOT, 'supabase/schema/SUPER_MASTER_SCHEMA.sql');
const MIGRATIONS_DIR = join(ROOT, 'supabase/migrations');

const schema = readFileSync(SCHEMA_FILE, 'utf-8').toLowerCase().replace(/\s+/g, ' ').replace(/public\./g, '');

/**
 * Normalize SQL for comparison — also strips public. prefix for clean matching.
 */
function n(sql) {
  return sql.replace(/\s+/g, ' ').trim().toLowerCase().replace(/public\./g, '');
}

/**
 * Check if a pattern exists in the schema (normalized).
 */
function has(pattern) {
  return schema.includes(n(pattern));
}

const files = readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
let errors = [];

for (const file of files) {
  const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');

  // Skip files that only drop/recreate triggers/functions we know evolve (order number trigger)
  // These are handled by checking the LATEST version in master schema
  
  // Extract all DDL statements (simplified — check key patterns)
  const lines = sql.split('\n').filter(l => l.trim() && !l.trim().startsWith('--'));

  // Check CREATE TABLE IF NOT EXISTS
  const createTables = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)/gi) || [];
  for (const ct of createTables) {
    const tableName = ct.match(/(\w+)$/i)[1];
    if (!has(`create table if not exists ${tableName.toLowerCase()} (`)) {
      errors.push(`${file}: CREATE TABLE ${tableName} NOT FOUND in master schema`);
    }
  }

  // Check ALTER TABLE ... ADD COLUMN IF NOT EXISTS (not ADD CONSTRAINT)
  const addCols = sql.match(/ALTER\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)\s+ADD\s+(?:COLUMN\s+)(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s+/gi) || [];
  for (const ac of addCols) {
    const [, table, col] = ac.match(/ALTER\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)\s+ADD\s+(?:COLUMN\s+)?(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
    if (!has(`${col.toLowerCase()}`)) {
      errors.push(`${file}: ALTER TABLE ${table} ADD COLUMN ${col} — column NOT FOUND in master schema`);
    }
  }

  // Check CREATE INDEX IF NOT EXISTS (skip dynamic ones)
  const indexes = sql.match(/CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/gi) || [];
  for (const idx of indexes) {
    const idxName = idx.match(/(?:INDEX\s+)?(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i)[1];
    if (idxName.startsWith('idx_') && !has(`create index if not exists ${idxName.toLowerCase()}`) && !has(`create unique index if not exists ${idxName.toLowerCase()}`)) {
      errors.push(`${file}: INDEX ${idxName} NOT FOUND in master schema`);
    }
  }

  // Check ALTER TABLE ... ENABLE ROW LEVEL SECURITY
  const rls = sql.match(/ALTER\s+TABLE\s+(?:public\.)?(\w+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/gi) || [];
  for (const r of rls) {
    const tbl = r.match(/ALTER\s+TABLE\s+(?:public\.)?(\w+)/i)[1];
    if (!has(`alter table ${tbl.toLowerCase()} enable row level security`)) {
      errors.push(`${file}: RLS on ${tbl} NOT FOUND in master schema`);
    }
  }

  // Check CREATE POLICY
  const policies = sql.match(/CREATE\s+POLICY\s+"?(\w+(?:\s+\w+)*)"?\s+ON/gi) || [];
  for (const p of policies) {
    const match = p.match(/CREATE\s+POLICY\s+"?([^"]+)"?\s+ON/i) || p.match(/CREATE\s+POLICY\s+(\w+)\s+ON/i);
    if (match) {
      const polName = match[1].toLowerCase().replace(/\s+/g, ' ');
      if (!has(`create policy "${polName}"`)) {
        errors.push(`${file}: POLICY "${polName}" NOT FOUND in master schema`);
      }
    }
  }

  // Check ALTER TABLE ... DROP COLUMN IF EXISTS
  const dropCols = sql.match(/ALTER\s+TABLE\s+(?:public\.)?(\w+)\s+DROP\s+(?:COLUMN\s+)?(?:IF\s+EXISTS\s+)?(\w+)/gi) || [];
  for (const dc of dropCols) {
    const [, table, col] = dc.match(/ALTER\s+TABLE\s+(?:public\.)?(\w+)\s+DROP\s+(?:COLUMN\s+)?(?:IF\s+EXISTS\s+)?(\w+)/i);
    // Check if column appears in the table's CREATE TABLE definition specifically
    const tableDefMatch = schema.match(new RegExp(`create table if not exists ${table.toLowerCase()}\\s*\\([^)]+`));
    if (tableDefMatch && tableDefMatch[0].includes(col.toLowerCase())) {
      errors.push(`${file}: DROP COLUMN ${table}.${col} — column STILL EXISTS in table definition in master schema`);
    }
  }

  // Check INSERT INTO ... VALUES (seed data — only system-level inserts with fixed IDs)
  const inserts = sql.match(/INSERT\s+INTO\s+(?:public\.)?(\w+)\s+.*VALUES\s*\([^)]*00000000-[^)]*\)/gis) || [];
  for (const ins of inserts) {
    const tableMatch = ins.match(/INSERT\s+INTO\s+(?:public\.)?(\w+)/i);
    if (tableMatch) {
      const table = tableMatch[1].toLowerCase();
      if (!has(`insert into ${table}`)) {
        errors.push(`${file}: System seed INSERT INTO ${table} NOT FOUND in master schema`);
      }
    }
  }

  // Check INSERT INTO ... ON CONFLICT (seed data)
  const insertConflicts = sql.match(/INSERT\s+INTO\s+(?:public\.)?(\w+)\s+.*ON\s+CONFLICT/gi) || [];
  for (const ic of insertConflicts) {
    const tableMatch = ic.match(/INSERT\s+INTO\s+(?:public\.)?(\w+)/i);
    if (tableMatch) {
      const table = tableMatch[1].toLowerCase();
      if (!has(`insert into ${table}`) && !has(`on conflict`)) {
        errors.push(`${file}: Seed INSERT INTO ${table} NOT FOUND in master schema`);
      }
    }
  }
  
  // Check CREATE OR REPLACE FUNCTION (only check once per function, skip if order_number)
  const funcs = sql.match(/CREATE\s+OR\s+REPLACE\s+FUNCTION\s+(?:public\.)?(\w+)/gi) || [];
  for (const f of funcs) {
    const funcName = f.match(/(\w+)$/i)[1];
    if (funcName === 'generate_order_number' || funcName === 'http_request' || funcName === 'update_updated_at' || 
        funcName === 'update_product_reviews_stats' || funcName === 'sync_settings_to_ai' || funcName === 'sync_ai_to_settings' ||
        funcName === 'link_order_to_abandoned_cart') continue;
    if (!has(`function ${funcName}`)) {
      errors.push(`${file}: FUNCTION ${funcName} NOT FOUND in master schema`);
    }
  }
}

if (errors.length === 0) {
  console.log(`✅ CHECK PASSED: All ${files.length} migrations fully reflected in SUPER_MASTER_SCHEMA.sql`);
  process.exit(0);
} else {
  console.log(`❌ CHECK FAILED: ${errors.length} issue(s) found:\n`);
  // Deduplicate
  const unique = [...new Set(errors)];
  unique.forEach(e => console.log(`  ${e}`));
  console.log(`\n⚠️  Fix these in supabase/schema/SUPER_MASTER_SCHEMA.sql before proceeding.`);
  process.exit(1);
}

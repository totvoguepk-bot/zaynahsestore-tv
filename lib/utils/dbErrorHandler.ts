/**
 * Centralized Database and Application Error Diagnostic utility.
 * Automatically parses PostgREST, PostgreSQL, RLS, and Schema errors
 * to provide a copy-pasteable visual block in the server console indicating
 * the exact file, function, table, and solution hints.
 */

interface ErrorContext {
  file: string;
  functionName: string;
  table?: string;
  action?: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'UPSERT' | 'RPC';
}

export function logDbError(context: ErrorContext, error: any) {
  const errCode = error?.code || (error as any)?.statusCode || 'UNKNOWN_CODE';
  const errMsg = error?.message || (error as any)?.details || String(error);
  const errHint = error?.hint || '';
  const errDetails = error?.details || '';

  // Detect specific PostgreSQL / Supabase issues and generate diagnostic suggestions
  let diagnosticTip = 'Check database logs, RLS policies, or connection parameters.';
  let detectedIssueType = 'Generic Database Exception';

  if (errCode === '54001' || errMsg.includes('stack depth limit exceeded') || errMsg.includes('recursion')) {
    detectedIssueType = 'Trigger Recursion Loop';
    diagnosticTip = `An infinite update recursion has been detected in table "${context.table || 'unknown'}".\n` +
      `   This usually happens when two tables sync updates to each other via triggers.\n` +
      `   Fix: Add "IF pg_trigger_depth() > 1 THEN RETURN NEW; END IF;" at the start of the triggers.`;
  } else if (errCode === '42703' || errMsg.includes('does not exist') || errMsg.includes('could not find column')) {
    detectedIssueType = 'Missing Database Column / Column Mismatch';
    const colMatch = errMsg.match(/column "(.*?)"/i) || errMsg.match(/column (.*?) does not exist/i);
    const columnName = colMatch ? colMatch[1] : 'column_name';
    const tableName = context.table || 'table_name';
    diagnosticTip = `Column "${columnName}" is missing from table "${tableName}" in the database.\n` +
      `   To fix, execute the following SQL migration in Supabase SQL editor:\n` +
      `   ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} TEXT;`;
  } else if (errCode === '42501' || errMsg.includes('row-level security') || errMsg.includes('policy')) {
    detectedIssueType = 'Row Level Security (RLS) Violation';
    const tableName = context.table || 'table_name';
    diagnosticTip = `The authenticated role does not have permission to execute this operation on table "${tableName}".\n` +
      `   To fix, check RLS policies on table "${tableName}". You may need to define an INSERT/UPDATE policy:\n` +
      `   CREATE POLICY "Allow update" ON public.${tableName} FOR UPDATE USING (auth.role() = 'authenticated');`;
  } else if (errCode === '23505' || errMsg.includes('duplicate key value')) {
    detectedIssueType = 'Unique Constraint Violation (Duplicate Key)';
    diagnosticTip = `An attempt was made to insert a row with an already existing unique key (e.g. duplicate slug or duplicate order number).\n` +
      `   Please verify unique constraints or handle conflicts using ON CONFLICT (upsert).`;
  } else if (errCode === '23503' || errMsg.includes('foreign key constraint')) {
    detectedIssueType = 'Foreign Key Constraint Violation';
    diagnosticTip = `The operation references a record in another table that does not exist (e.g. invalid category_id, product_id, or order_id).\n` +
      `   Verify that the referenced row ID exists before inserting/updating.`;
  } else if (errCode === 'PGRST204' || errCode === 'PGRST200') {
    detectedIssueType = 'PostgREST Query Schema Mismatch';
    diagnosticTip = `Supabase PostgREST returned a 400 Bad Request indicating a column mismatch between the service action payload and the DB schema.\n` +
      `   Verify that all keys in the JS payload match snake_case columns in the "${context.table || 'unknown'}" table.`;
  }

  // Build a highly visible ASCII diagnostics output in the server console log
  const boxWidth = 85;
  const separator = '='.repeat(boxWidth);
  const thinSeparator = '-'.repeat(boxWidth);

  console.error(`\n${separator}`);
  console.error(`🚨 DATABASE DIAGNOSTICS ERROR REPORT`);
  console.error(thinSeparator);
  console.error(`📍 LOCATION:     ${context.file} -> ${context.functionName}()`);
  if (context.table)  console.error(`🗄️ TABLE:        ${context.table}`);
  if (context.action) console.error(`💥 OPERATION:    ${context.action}`);
  console.error(`🏷️ ISSUE TYPE:   ${detectedIssueType}`);
  console.error(`🔑 ERROR CODE:   ${errCode}`);
  console.error(`💬 MESSAGE:      ${errMsg}`);
  if (errDetails)      console.error(`🔍 DB DETAILS:   ${errDetails}`);
  if (errHint)         console.error(`💡 DB HINT:      ${errHint}`);
  console.error(thinSeparator);
  console.error(`🛠️ SUGGESTED ACTION / SOLUTION:`);
  console.error(`   ${diagnosticTip.replace(/\n/g, '\n   ')}`);
  console.error(`${separator}\n`);
}

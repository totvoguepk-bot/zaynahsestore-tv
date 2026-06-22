# 🚨 DATABASE & APPLICATION ERROR TRACKING SYSTEM

This project uses a standardized diagnostics logging system for database and API transactions to print visual, copy-paste-ready error reports in the console.

---

## 🛠️ How to Use It

All service functions (`lib/services/`) and API routes (`app/api/`) must wrap their database queries in `try/catch` blocks and pass errors through `logDbError` from `@/lib/utils/dbErrorHandler`.

### Standard Pattern

```typescript
import { logDbError } from '@/lib/utils/dbErrorHandler';

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
      
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    // 1. Log detailed diagnostics to console
    logDbError({
      file: 'lib/services/products.ts',
      functionName: 'getProducts',
      table: 'products',
      action: 'SELECT'
    }, error);
    
    // 2. Re-throw for caller handling
    throw error;
  }
};
```

---

## 📋 What the Logs Look Like

When an error happens (e.g., trigger recursion, RLS violation, or a missing column in a newer branch/clone), the console will print a structured report:

```text
=====================================================================================
🚨 DATABASE DIAGNOSTICS ERROR REPORT
-------------------------------------------------------------------------------------
📍 LOCATION:     lib/services/settings.ts -> updateSettings()
🗄️ TABLE:        store_settings
💥 OPERATION:    UPDATE
🏷️ ISSUE TYPE:   Trigger Recursion Loop
🔑 ERROR CODE:   54001
💬 MESSAGE:      stack depth limit exceeded
-------------------------------------------------------------------------------------
🛠️ SUGGESTED ACTION / SOLUTION:
   An infinite update recursion has been detected in table "store_settings".
   This usually happens when two tables sync updates to each other via triggers.
   Fix: Add "IF pg_trigger_depth() > 1 THEN RETURN NEW; END IF;" at the start of the triggers.
=====================================================================================
```

---

## ⛔ Rule for AI Agents & Developers

1. **Never suppress errors** with empty `catch` blocks.
2. Always log database failures using `logDbError` with accurate `file`, `functionName`, `table`, and `action` parameters.
3. Keep the central master schema `SUPER_MASTER_SCHEMA.sql` updated with any database column, constraint, or trigger changes.

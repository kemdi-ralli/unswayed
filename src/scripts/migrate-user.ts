// scripts/migrate-users.ts (run on server environment where env vars are present)
import { supabaseAdmin } from "../lib/supabaseAdmin";
import type { IncomingUser } from "../types/user";

// Replace with real fetch from your legacy DB
async function fetchLegacyUsers(): Promise<any[]> {
  // Example: query your legacy DB, Prisma, MySQL, etc.
  return [];
}

function sanitizeRowForScript(u: any) {
  // similar sanitizeRow logic; map u.id -> source_id, lowercase email etc.
}

async function migrate() {
  const legacy = await fetchLegacyUsers();
  const rows = legacy.map(u => {
    const mapped = { ...u };
    if (u.id !== undefined && mapped.source_id === undefined) mapped.source_id = u.id;
    return sanitizeRowForScript(mapped);
  });
  // upsert in batches
  const batchSize = 200;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabaseAdmin.from("external_users")
      .upsert(batch, { onConflict: "source_id,email" });
    if (error) throw error;
    console.log(`Migrated batch ${i}..${i + batch.length}`);
  }
}

migrate().catch(e => { console.error(e); process.exit(1); });

// app/api/sync-users/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_KEYS = new Set([
  "email",
  "first_name",
  "middle_name",
  "last_name",
  "username",
  "type",
  "email_verified_at",
  "photo",
  "phone",
  "zip_code",
  "address",
  "about",
  "remember_token",
  "created_at",
  "updated_at",
  "country_id",
  "state_id",
  "city_id",
  "last_seen_at",
  "metadata",
  "migrated",
  "source_id",
]);

function sanitizeRow(row: any) {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(row)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    out[key] = value === undefined ? null : value;
  }
  if (row.id) out.source_id = row.id;
  if (out.email) out.email = out.email.toLowerCase();
  if (!out.password) out.password = "EXTERNAL_SYNC_PLACEHOLDER";
  if ("migrated" in out) out.migrated = !!out.migrated;
  return out;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const sanitized = body.map(sanitizeRow);

    const { data, error } = await supabase
      .from("external_users")
      .upsert(sanitized, { onConflict: "source_id,email", ignoreDuplicates: false })
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      inserted: data?.length || 0,
    });
  } catch (err: any) {
    console.error("Sync failed:", err);
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}

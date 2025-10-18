"use client";
import React, { useEffect, useState } from "react";
import type { IncomingUser } from "../../types/user";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_PROFILE } from "@/services/apiService/apiEndPoints";

function normalizeUser(u: any): IncomingUser {
  const nullify = (v: any) => (v === undefined ? null : v);
  return {
    id: nullify(u.id ?? null),
    email: nullify(u.email ?? null),
    first_name: nullify(u.first_name ?? null),
    middle_name: nullify(u.middle_name ?? null),
    last_name: nullify(u.last_name ?? null),
    username: nullify(u.username ?? null),
    type: nullify(u.type ?? null),
    email_verified_at: nullify(u.email_verified_at ?? null),
    photo: nullify(u.photo ?? null),
    phone: nullify(u.phone ?? null),
    zip_code: nullify(u.zip_code ?? null),
    address: nullify(u.address ?? null),
    password: nullify(u.password ?? null),
    about: nullify(u.about ?? null),
    remember_token: nullify(u.remember_token ?? null),
    created_at: nullify(u.created_at ?? null),
    updated_at: nullify(u.updated_at ?? null),
    country_id: nullify(u.country_id ?? null),
    state_id: nullify(u.state_id ?? null),
    city_id: nullify(u.city_id ?? null),
    last_seen_at: nullify(u.last_seen_at ?? null),
    metadata: u.metadata ?? null,
    migrated: u.migrated === undefined ? false : !!u.migrated,
  };
}

export default function UserSyncButton() {
  const [status, setStatus] = useState<"idle" | "syncing" | "done" | "error">("idle");
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    const syncUser = async () => {
      if (!mounted) return;
      setStatus("syncing");
      setLog(["Fetching user from API..."]);

      try {
        // 1️⃣ Fetch existing user from your API
        const response = await apiInstance.get(GET_PROFILE);
        const s = response?.data?.data?.user;
        if (!s || !s.email) {
          setLog((l) => [...l, "No valid user found in GET_PROFILE response."]);
          setStatus("done");
          return;
        }

        const normalizedUser = normalizeUser(s);

        // 2️⃣ Post to Supabase via Next.js API
        const resp = await fetch("/api/sync-users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // If you configured an optional token, uncomment next line:
            // "x-sync-token": process.env.NEXT_PUBLIC_SYNC_API_TOKEN || "",
          },
          body: JSON.stringify([normalizedUser]),
        });

        if (!resp.ok) {
          const errText = await resp.text();
          setLog((l) => [...l, `Sync failed: ${resp.status} ${errText}`]);
          setStatus("error");
          return;
        }

        const json = await resp.json();
        setLog((l) => [...l, `✅ User synced successfully: inserted=${json.inserted ?? 1}`]);
        setStatus("done");
      } catch (error: any) {
        setLog((l) => [...l, `Sync error: ${String(error)}`]);
        setStatus("error");
      }
    };

    syncUser();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
      <strong>Sync User to Supabase</strong>
      <div style={{ marginTop: 8 }}>
        Status: <em>{status}</em>
      </div>
      <div style={{ marginTop: 8 }}>
        <small>Logs:</small>
        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            background: "#fafafa",
            padding: 8,
            marginTop: 6,
          }}
        >
          {log.map((line, i) => (
            <div key={i} style={{ fontSize: 12 }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

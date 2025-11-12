// app/api/affinda/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ALLOWED_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  try {
    const AFFINDA_KEY = process.env.AFFINDA_API_KEY;
    const DEFAULT_WORKSPACE = process.env.AFFINDA_WORKSPACE_ID;

    if (!AFFINDA_KEY) {
      return NextResponse.json(
        { error: "Server misconfiguration: missing AFFINDA_API_KEY" },
        { status: 500 }
      );
    }

    // Parse multipart form
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (!ALLOWED_MIMES.includes(file.type))
      return NextResponse.json(
        { error: "Unsupported file type. Allowed: pdf, doc, docx" },
        { status: 400 }
      );

    if (file.size > MAX_FILE_BYTES)
      return NextResponse.json(
        { error: "File too large (max 10 MB)" },
        { status: 400 }
      );

    // Determine workspace
    const workspaceFromClient =
      (formData.get("workspace") as string) ||
      (formData.get("workspace_id") as string);
    const workspaceToUse = workspaceFromClient || DEFAULT_WORKSPACE;

    if (!workspaceToUse) {
      return NextResponse.json(
        {
          error:
            "Workspace is required. Set AFFINDA_WORKSPACE_ID in env or include 'workspace' in the form data.",
        },
        { status: 400 }
      );
    }

    // --- 🔍 Fetch available document types from this workspace ---
    let resumeTypeIdentifier = "cBvJVvmL";
    try {
      const docTypeRes = await fetch(
        `https://api.affinda.com/v3/workspaces/${workspaceToUse}/documentTypes`,
        {
          headers: { Authorization: `Bearer ${AFFINDA_KEY}` },
        }
      );

      if (docTypeRes.ok) {
        const data = await docTypeRes.json();
        const resumeType = data.results?.find(
          (t: any) =>
            t.name?.toLowerCase().includes("resume") ||
            t.identifier?.toLowerCase().includes("resume")
        );
        if (resumeType) resumeTypeIdentifier = resumeType.identifier;
      } else {
        console.warn(
          "Warning: Could not fetch document types, defaulting to 'resume'"
        );
      }
    } catch (e) {
      console.warn("Document type fetch failed, defaulting to 'resume'");
    }

    // --- Build the form for Affinda ---
    const forwardForm = new FormData();

    // Append the file properly
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });
    forwardForm.append("file", blob, (file as any).name || "resume");

    // Workspace and document type
    forwardForm.append("workspace", workspaceToUse);
    forwardForm.append("document_type", resumeTypeIdentifier);

    // Optional fields
    const optionalKeys = ["language", "callback_url"];
    for (const key of optionalKeys) {
      const val = formData.get(key);
      if (val) forwardForm.append(key, String(val));
    }

    // --- Send to Affinda ---
    const affRes = await fetch("https://api.affinda.com/v3/documents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AFFINDA_KEY}`,
      } as any,
      body: forwardForm,
    });

    const text = await affRes.text();
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: affRes.status });
    } catch {
      return new Response(text, {
        status: affRes.status,
        headers: { "content-type": "text/plain" },
      });
    }
  } catch (err: any) {
    console.error("Affinda proxy error:", err);
    return NextResponse.json(
      { error: "Server error while parsing resume" },
      { status: 500 }
    );
  }
}

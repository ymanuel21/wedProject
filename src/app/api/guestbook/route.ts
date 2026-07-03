import { NextResponse } from "next/server";

const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL || "";

function maskUrl(url: string): string {
  if (!url) return "(empty)";
  return url.replace(/\/s\/[^/]+/, "/s/***");
}

function log(step: string, detail?: unknown) {
  const ts = new Date().toISOString();
  const d = detail !== undefined ? JSON.stringify(detail).slice(0, 400) : "";
  console.log(`[GuestBook API] [${ts}] ${step} ${d}`);
}

// ── GET ───────────────────────────────────────────────────────

export async function GET() {
  const requestId = Math.random().toString(36).slice(2, 8);

  try {
    log(`[${requestId}] Incoming GET request`);
    log(`[${requestId}] GAS_URL: ${maskUrl(GAS_URL)}`);

    if (!GAS_URL) {
      log(`[${requestId}] Mock mode`);
      return NextResponse.json({
        success: true,
        messages: [
          { timestamp: new Date().toISOString(), name: "Budi & Ani", message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah." },
          { timestamp: new Date().toISOString(), name: "Rina", message: "Happy wedding ya Dewi & Budi! God bless your marriage always." },
        ],
      });
    }

    log(`[${requestId}] Fetching from GAS`);

    let response: Response;
    try {
      response = await fetch(`${GAS_URL}?type=guestbook`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`[${requestId}] Fetch failed`, msg);
      return NextResponse.json({ success: false, messages: [], stage: "fetch-failed", error: msg }, { status: 502 });
    }

    log(`[${requestId}] GAS status: ${response.status}`);

    const text = await response.text();
    log(`[${requestId}] GAS body`, text.slice(0, 300));

    if (!response.ok) {
      return NextResponse.json({ success: false, messages: [], stage: "gas-error", status: response.status }, { status: 502 });
    }

    let data: { success?: boolean; messages?: unknown[] };
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ success: false, messages: [], stage: "invalid-json" }, { status: 502 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log(`[${requestId}] UNCAUGHT`, msg);
    return NextResponse.json({ success: false, messages: [], stage: "unexpected-error", error: msg }, { status: 500 });
  }
}

// ── POST ──────────────────────────────────────────────────────

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).slice(2, 8);

  try {
    log(`[${requestId}] Incoming POST request`);

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, stage: "parse-body", error: "Invalid JSON" }, { status: 400 });
    }

    const name = String(body.name || "").trim();
    const message = String(body.message || "").trim();

    log(`[${requestId}] Fields`, { name });

    if (!name || !message) {
      return NextResponse.json({ success: false, stage: "validation", error: "Nama dan ucapan wajib diisi." }, { status: 400 });
    }

    if (!GAS_URL) {
      log(`[${requestId}] Mock mode`);
      return NextResponse.json({ success: true, message: "Ucapan terkirim! (Mock)" });
    }

    log(`[${requestId}] Forwarding to GAS`);

    let response: Response;
    try {
      response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "guestbook", name, message }),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`[${requestId}] Fetch failed`, msg);
      return NextResponse.json({ success: false, stage: "fetch-failed", error: msg }, { status: 502 });
    }

    log(`[${requestId}] GAS status: ${response.status}`);

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json({ success: false, stage: "gas-error", error: text.slice(0, 200), status: response.status }, { status: 502 });
    }

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ success: false, stage: "invalid-json", error: text.slice(0, 200) }, { status: 502 });
    }

    return NextResponse.json(data as Record<string, unknown>);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log(`[${requestId}] UNCAUGHT`, msg);
    return NextResponse.json({ success: false, stage: "unexpected-error", error: msg }, { status: 500 });
  }
}

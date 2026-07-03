import { NextResponse } from "next/server";

// ── Configuration ─────────────────────────────────────────────

function getValidatedGasUrl(): { valid: true; url: string } | { valid: false; error: ReturnType<typeof NextResponse.json> } {
  const raw = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (raw === undefined) {
    console.log("[GuestBook API] GOOGLE_APPS_SCRIPT_URL is not set — using mock mode");
    return { valid: true, url: "" };
  }

  const trimmed = raw.trim();

  if (!trimmed) {
    console.log("[GuestBook API] GOOGLE_APPS_SCRIPT_URL is empty — using mock mode");
    return { valid: true, url: "" };
  }

  const masked = trimmed.replace(/\/s\/[^/]+/, "/s/***");
  console.log(`[GuestBook API] GOOGLE_APPS_SCRIPT_URL = ${masked}`);

  if (!trimmed.startsWith("https://")) {
    console.error(`[GuestBook API] Invalid URL — must start with https://`);
    return {
      valid: false,
      error: NextResponse.json(
        { success: false, stage: "configuration", reason: "GOOGLE_APPS_SCRIPT_URL must start with https://", valuePreview: `${trimmed.slice(0, 40)}...`, status: 500 },
        { status: 500 }
      ),
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      valid: false,
      error: NextResponse.json(
        { success: false, stage: "configuration", reason: `Invalid GOOGLE_APPS_SCRIPT_URL: ${msg}`, valuePreview: `${trimmed.slice(0, 40)}...`, status: 500 },
        { status: 500 }
      ),
    };
  }

  if (!parsed.hostname.endsWith("script.google.com")) {
    return {
      valid: false,
      error: NextResponse.json(
        { success: false, stage: "configuration", reason: "GOOGLE_APPS_SCRIPT_URL must point to script.google.com", hostname: parsed.hostname, status: 500 },
        { status: 500 }
      ),
    };
  }

  console.log(`[GuestBook API] URL validated: ${masked}`);
  return { valid: true, url: trimmed };
}

// ── Helpers ───────────────────────────────────────────────────

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

    const config = getValidatedGasUrl();
    if (!config.valid) return config.error;
    const GAS_URL = config.url;

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

    const text = await response.text();

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

    const config = getValidatedGasUrl();
    if (!config.valid) return config.error;
    const GAS_URL = config.url;

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

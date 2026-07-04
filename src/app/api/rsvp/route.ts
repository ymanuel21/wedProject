import { NextResponse } from "next/server";
import { validatePhone } from "@/lib/phone-validation";

// ── Configuration ──

function getValidatedGasUrl(): { valid: true; url: string } | { valid: false; error: ReturnType<typeof NextResponse.json> } {
  const raw = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (raw === undefined) {
    console.log("[RSVP API] GOOGLE_APPS_SCRIPT_URL is not set — using mock mode");
    return { valid: true, url: "" };
  }

  const trimmed = raw.trim();

  if (!trimmed) {
    console.log("[RSVP API] GOOGLE_APPS_SCRIPT_URL is empty — using mock mode");
    return { valid: true, url: "" };
  }

  const masked = trimmed.replace(/\/s\/[^/]+/, "/s/***");
  console.log(`[RSVP API] GOOGLE_APPS_SCRIPT_URL = ${masked}`);

  if (!trimmed.startsWith("https://")) {
    console.error(`[RSVP API] Invalid URL — must start with https://. Got: ${masked}`);
    return {
      valid: false,
      error: NextResponse.json(
        {
          success: false,
          stage: "configuration",
          reason: "GOOGLE_APPS_SCRIPT_URL must start with https://",
          valuePreview: `${trimmed.slice(0, 40)}...`,
          status: 500,
        },
        { status: 500 }
      ),
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[RSVP API] Invalid URL — ${msg}. Raw: ${masked}`);
    return {
      valid: false,
      error: NextResponse.json(
        {
          success: false,
          stage: "configuration",
          reason: `Invalid GOOGLE_APPS_SCRIPT_URL: ${msg}`,
          valuePreview: `${trimmed.slice(0, 40)}...`,
          status: 500,
        },
        { status: 500 }
      ),
    };
  }

  if (!parsed.hostname.endsWith("script.google.com")) {
    console.error(`[RSVP API] Wrong hostname: ${parsed.hostname}`);
    return {
      valid: false,
      error: NextResponse.json(
        {
          success: false,
          stage: "configuration",
          reason: "GOOGLE_APPS_SCRIPT_URL must point to script.google.com",
          hostname: parsed.hostname,
          status: 500,
        },
        { status: 500 }
      ),
    };
  }

  console.log(`[RSVP API] URL validated: ${masked}`);
  return { valid: true, url: trimmed };
}

// ── Helpers ──

function maskUrl(url: string): string {
  if (!url) return "(empty)";
  return url.replace(/\/s\/[^/]+/, "/s/***");
}

function log(step: string, detail?: unknown) {
  const ts = new Date().toISOString();
  const d = detail !== undefined ? JSON.stringify(detail).slice(0, 400) : "";
  console.log(`[RSVP API] [${ts}] ${step} ${d}`);
}

// ── Handler ──

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).slice(2, 8);

  try {
    log(`[${requestId}] Incoming request`);

    const config = getValidatedGasUrl();
    if (!config.valid) {
      log(`[${requestId}] Configuration invalid — returning error`);
      return config.error;
    }
    const GAS_URL = config.url;

    let body: Record<string, unknown>;
    try {
      body = await request.json();
      log(`[${requestId}] Body parsed`, { name: body.name });
    } catch (err) {
      log(`[${requestId}] Body parse failed`, err);
      return NextResponse.json(
        { success: false, stage: "parse-body", error: "Invalid JSON body", status: 400 },
        { status: 400 }
      );
    }

    log(`[${requestId}] Validating fields`);

    if (!body.name || !String(body.name).trim()) {
      return NextResponse.json(
        { success: false, stage: "validation", error: "Nama wajib diisi.", status: 400 },
        { status: 400 }
      );
    }

    const phoneResult = validatePhone(String(body.phone || ""));
    if (!phoneResult.valid) {
      log(`[${requestId}] Phone validation failed`, phoneResult.message);
      return NextResponse.json(
        { success: false, stage: "validation", error: phoneResult.message, status: 400 },
        { status: 400 }
      );
    }

    body.phone = phoneResult.normalized;
    log(`[${requestId}] Phone normalized: ${phoneResult.normalized.slice(0, 4)}...`);

    if (!GAS_URL) {
      log(`[${requestId}] Mock mode — GAS_URL is empty`);
      return NextResponse.json({
        success: true,
        message: "RSVP berhasil dikirim. Terima kasih! (Mock)",
      });
    }

    log(`[${requestId}] Forwarding to Google Apps Script`);

    let response: Response;
    try {
      response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "rsvp", ...body }),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      log(`[${requestId}] Fetch failed`, msg);
      return NextResponse.json(
        { success: false, stage: "fetch-google-apps-script", error: msg, status: 502 },
        { status: 502 }
      );
    }

    log(`[${requestId}] GAS response status: ${response.status}`);

    const responseText = await response.text();
    log(`[${requestId}] GAS response body`, responseText.slice(0, 500));

    if (!response.ok) {
      return NextResponse.json(
        { success: false, stage: "google-apps-script-error", error: responseText.slice(0, 300), status: response.status },
        { status: 502 }
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(responseText);
    } catch {
      log(`[${requestId}] GAS response is not valid JSON`);
      return NextResponse.json(
        { success: false, stage: "invalid-json-response", error: "Google Apps Script returned non-JSON response", rawResponse: responseText.slice(0, 200), status: 502 },
        { status: 502 }
      );
    }

    log(`[${requestId}] Returning success to client`);
    return NextResponse.json(data as Record<string, unknown>);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    log(`[${requestId}] UNCAUGHT ERROR`, { message: msg, stack: stack?.slice(0, 500) });
    return NextResponse.json(
      { success: false, stage: "unexpected-error", error: msg, status: 500 },
      { status: 500 }
    );
  }
}

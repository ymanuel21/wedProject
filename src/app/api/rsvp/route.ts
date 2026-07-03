import { NextResponse } from "next/server";

const GAS_URL = process.env.GOOGLE_APPS_SCRIPT_URL || "";

function maskUrl(url: string): string {
  if (!url) return "(empty)";
  return url.replace(/\/s\/[^/]+/, "/s/***");
}

function log(step: string, detail?: unknown) {
  const ts = new Date().toISOString();
  const d = detail !== undefined ? JSON.stringify(detail).slice(0, 400) : "";
  console.log(`[RSVP API] [${ts}] ${step} ${d}`);
}

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).slice(2, 8);

  try {
    log(`[${requestId}] Incoming request`);
    log(`[${requestId}] GAS_URL: ${maskUrl(GAS_URL)}`);

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
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, stage: "validation", error: "Nama dan nomor telepon wajib diisi.", status: 400 },
        { status: 400 }
      );
    }

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
        {
          success: false,
          stage: "fetch-google-apps-script",
          error: msg,
          status: 502,
        },
        { status: 502 }
      );
    }

    log(`[${requestId}] GAS response status: ${response.status}`);

    const responseText = await response.text();
    log(`[${requestId}] GAS response body`, responseText.slice(0, 500));

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          stage: "google-apps-script-error",
          error: responseText.slice(0, 300),
          status: response.status,
        },
        { status: 502 }
      );
    }

    let data: unknown;
    try {
      data = JSON.parse(responseText);
    } catch {
      log(`[${requestId}] GAS response is not valid JSON`);
      return NextResponse.json(
        {
          success: false,
          stage: "invalid-json-response",
          error: "Google Apps Script returned non-JSON response",
          rawResponse: responseText.slice(0, 200),
          status: 502,
        },
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
      {
        success: false,
        stage: "unexpected-error",
        error: msg,
        status: 500,
      },
      { status: 500 }
    );
  }
}

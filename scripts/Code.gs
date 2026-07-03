/**
 * Google Apps Script Web App — Wedding RSVP & Guest Book
 *
 * Deployment instructions:
 * 1. Open https://script.google.com
 * 2. Create a new project
 * 3. Paste this entire file
 * 4. Create two Google Sheets named:
 *    - "Wedding RSVP" (columns: Timestamp, Name, Phone, Attendance, GuestCount, Message)
 *    - "Wedding GuestBook" (columns: Timestamp, Name, Message)
 * 5. Click Deploy → New Deployment → Web App
 * 6. Set "Execute as" = Me, "Who has access" = Anyone
 * 7. Copy the deployment URL
 * 8. Set it as NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL in your Vercel env vars
 */

const RSVP_SHEET_NAME = "Wedding RSVP";
const GUESTBOOK_SHEET_NAME = "Wedding GuestBook";
const ALLOWED_ORIGIN = PropertiesService.getScriptProperties().getProperty("ALLOWED_ORIGIN") || "*";

function doPost(e: Record<string, unknown>) {
  return handleRequest(e, "POST");
}

function doGet(e: Record<string, unknown>) {
  return handleRequest(e, "GET");
}

function handleRequest(e: Record<string, unknown>, method: string) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  // CORS
  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle OPTIONS preflight
  if (method === "OPTIONS") {
    output.setContent(JSON.stringify({ success: true }));
    setHeaders(output, headers);
    return output;
  }

  if (method === "GET") {
    return handleGet(e, output, headers);
  }

  return handlePost(e, output, headers);
}

function handlePost(
  e: Record<string, unknown>,
  output: GoogleAppsScript.Content.TextOutput,
  headers: Record<string, string>
) {
  let body: Record<string, unknown>;

  try {
    body = JSON.parse((e.postData as { contents: string }).contents);
  } catch {
    output.setContent(JSON.stringify({ success: false, message: "Invalid JSON" }));
    setHeaders(output, headers);
    return output;
  }

  const type = body.type;

  if (type === "rsvp") {
    return handleRSVP(body, output, headers);
  }

  if (type === "guestbook") {
    return handleGuestBookSubmit(body, output, headers);
  }

  output.setContent(JSON.stringify({ success: false, message: "Unknown type" }));
  setHeaders(output, headers);
  return output;
}

function handleRSVP(
  body: Record<string, unknown>,
  output: GoogleAppsScript.Content.TextOutput,
  headers: Record<string, string>
) {
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const attendance = String(body.attendance || "hadir");
  const guestCount = Number(body.guestCount) || 1;
  const message = String(body.message || "").slice(0, 500);

  if (!name) {
    output.setContent(JSON.stringify({ success: false, message: "Nama wajib diisi." }));
    setHeaders(output, headers);
    return output;
  }

  if (!phone) {
    output.setContent(JSON.stringify({ success: false, message: "Nomor telepon wajib diisi." }));
    setHeaders(output, headers);
    return output;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RSVP_SHEET_NAME);
  if (!sheet) {
    output.setContent(JSON.stringify({ success: false, message: "Sheet not found: " + RSVP_SHEET_NAME }));
    setHeaders(output, headers);
    return output;
  }

  sheet.appendRow([new Date().toISOString(), name, phone, attendance, guestCount, message]);

  output.setContent(JSON.stringify({ success: true, message: "RSVP berhasil dikirim. Terima kasih!" }));
  setHeaders(output, headers);
  return output;
}

function handleGuestBookSubmit(
  body: Record<string, unknown>,
  output: GoogleAppsScript.Content.TextOutput,
  headers: Record<string, string>
) {
  const name = String(body.name || "").trim();
  const message = String(body.message || "").slice(0, 500);

  if (!name || !message) {
    output.setContent(JSON.stringify({ success: false, message: "Nama dan ucapan wajib diisi." }));
    setHeaders(output, headers);
    return output;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GUESTBOOK_SHEET_NAME);
  if (!sheet) {
    output.setContent(JSON.stringify({ success: false, message: "Sheet not found" }));
    setHeaders(output, headers);
    return output;
  }

  sheet.appendRow([new Date().toISOString(), name, message]);

  output.setContent(JSON.stringify({ success: true, message: "Ucapan terkirim!" }));
  setHeaders(output, headers);
  return output;
}

function handleGet(
  e: Record<string, unknown>,
  output: GoogleAppsScript.Content.TextOutput,
  headers: Record<string, string>
) {
  const type = (e.parameter as Record<string, string>)?.type;

  if (type === "guestbook") {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GUESTBOOK_SHEET_NAME);
    if (!sheet) {
      output.setContent(JSON.stringify({ success: false, messages: [] }));
      setHeaders(output, headers);
      return output;
    }

    const data = sheet.getDataRange().getValues();
    const messages = data.slice(1).map((row: unknown[]) => ({
      timestamp: String(row[0] || ""),
      name: String(row[1] || ""),
      message: String(row[2] || ""),
    }));

    output.setContent(JSON.stringify({ success: true, messages }));
    setHeaders(output, headers);
    return output;
  }

  output.setContent(JSON.stringify({ success: false, messages: [] }));
  setHeaders(output, headers);
  return output;
}

function setHeaders(output: GoogleAppsScript.Content.TextOutput, headers: Record<string, string>) {
  Object.entries(headers).forEach(([key, value]) => {
    output.addHeader(key, value);
  });
}

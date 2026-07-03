/**
 * Google Apps Script Web App — Wedding RSVP & Guest Book
 *
 * Deployment instructions:
 * 1. Open https://script.google.com and create a new project
 * 2. Paste this entire file (Ctrl+A, Ctrl+V)
 * 3. In the same Google account, create two Google Sheets:
 *    - "Wedding RSVP"   → columns: Timestamp | Name | Phone | Attendance | GuestCount | Message
 *    - "Wedding GuestBook" → columns: Timestamp | Name | Message
 * 4. Click Deploy → New Deployment → Web App
 * 5. Execute as: Me  |  Who has access: Anyone
 * 6. Copy the deployment URL and set it as NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL
 */

var RSVP_SHEET_NAME = "Wedding RSVP";
var GUESTBOOK_SHEET_NAME = "Wedding GuestBook";
var ALLOWED_ORIGIN =
  PropertiesService.getScriptProperties().getProperty("ALLOWED_ORIGIN") || "*";

// ── Entry Points ──────────────────────────────────────────────

function doPost(e) {
  return handleRequest_(e, "POST");
}

function doGet(e) {
  return handleRequest_(e, "GET");
}

// ── Request Router ────────────────────────────────────────────

function handleRequest_(e, method) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  var headers = {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (method === "OPTIONS") {
    output.setContent(JSON.stringify({ success: true }));
    setHeaders_(output, headers);
    return output;
  }

  if (method === "GET") {
    return handleGet_(e, output, headers);
  }

  return handlePost_(e, output, headers);
}

// ── POST Handler ──────────────────────────────────────────────

function handlePost_(e, output, headers) {
  var body;

  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    output.setContent(
      JSON.stringify({ success: false, message: "Invalid JSON" })
    );
    setHeaders_(output, headers);
    return output;
  }

  var type = body.type;

  if (type === "rsvp") {
    return handleRSVP_(body, output, headers);
  }

  if (type === "guestbook") {
    return handleGuestBookSubmit_(body, output, headers);
  }

  output.setContent(
    JSON.stringify({ success: false, message: "Unknown type: " + type })
  );
  setHeaders_(output, headers);
  return output;
}

// ── RSVP ──────────────────────────────────────────────────────

function handleRSVP_(body, output, headers) {
  var name = String(body.name || "").trim();
  var phone = String(body.phone || "").trim();
  var attendance = String(body.attendance || "hadir");
  var guestCount = Number(body.guestCount) || 1;
  var message = String(body.message || "").slice(0, 500);

  if (!name) {
    output.setContent(
      JSON.stringify({ success: false, message: "Nama wajib diisi." })
    );
    setHeaders_(output, headers);
    return output;
  }

  if (!phone) {
    output.setContent(
      JSON.stringify({ success: false, message: "Nomor telepon wajib diisi." })
    );
    setHeaders_(output, headers);
    return output;
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    RSVP_SHEET_NAME
  );
  if (!sheet) {
    output.setContent(
      JSON.stringify({
        success: false,
        message: "Sheet tidak ditemukan: " + RSVP_SHEET_NAME,
      })
    );
    setHeaders_(output, headers);
    return output;
  }

  sheet.appendRow([
    new Date().toISOString(),
    name,
    phone,
    attendance,
    guestCount,
    message,
  ]);

  output.setContent(
    JSON.stringify({
      success: true,
      message: "RSVP berhasil dikirim. Terima kasih!",
    })
  );
  setHeaders_(output, headers);
  return output;
}

// ── Guest Book Submit ─────────────────────────────────────────

function handleGuestBookSubmit_(body, output, headers) {
  var name = String(body.name || "").trim();
  var message = String(body.message || "").slice(0, 500);

  if (!name || !message) {
    output.setContent(
      JSON.stringify({
        success: false,
        message: "Nama dan ucapan wajib diisi.",
      })
    );
    setHeaders_(output, headers);
    return output;
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    GUESTBOOK_SHEET_NAME
  );
  if (!sheet) {
    output.setContent(
      JSON.stringify({
        success: false,
        message: "Sheet tidak ditemukan: " + GUESTBOOK_SHEET_NAME,
      })
    );
    setHeaders_(output, headers);
    return output;
  }

  sheet.appendRow([new Date().toISOString(), name, message]);

  output.setContent(
    JSON.stringify({ success: true, message: "Ucapan terkirim!" })
  );
  setHeaders_(output, headers);
  return output;
}

// ── GET Handler (Guest Book Reader) ───────────────────────────

function handleGet_(e, output, headers) {
  var params = e.parameter || {};
  var type = params.type;

  if (type === "guestbook") {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      GUESTBOOK_SHEET_NAME
    );
    if (!sheet) {
      output.setContent(JSON.stringify({ success: false, messages: [] }));
      setHeaders_(output, headers);
      return output;
    }

    var data = sheet.getDataRange().getValues();
    var messages = [];

    // Skip header row (index 0), map remaining rows
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      messages.push({
        timestamp: String(row[0] || ""),
        name: String(row[1] || ""),
        message: String(row[2] || ""),
      });
    }

    output.setContent(JSON.stringify({ success: true, messages: messages }));
    setHeaders_(output, headers);
    return output;
  }

  output.setContent(JSON.stringify({ success: false, messages: [] }));
  setHeaders_(output, headers);
  return output;
}

// ── Header Helper ─────────────────────────────────────────────

function setHeaders_(output, headers) {
  var keys = Object.keys(headers);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    output.addHeader(key, headers[key]);
  }
}

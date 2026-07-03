/**
 * Google Apps Script Web App — Wedding RSVP & Guest Book
 *
 * Deployment instructions:
 * 1. Open https://script.google.com and create a new project
 * 2. Paste this entire file
 * 3. In the same Google account, create a Google Sheet with two tabs:
 *    - "Wedding RSVP"   → columns: Timestamp | Name | Phone | Attendance | GuestCount | Message
 *    - "Wedding GuestBook" → columns: Timestamp | Name | Message
 * 4. Click Deploy → New Deployment → Web App
 * 5. Execute as: Me  |  Who has access: Anyone
 * 6. Copy the deployment URL
 *
 * Note: CORS is handled by the Next.js API proxy — no CORS headers needed here.
 */

var RSVP_SHEET_NAME = "Wedding RSVP";
var GUESTBOOK_SHEET_NAME = "Wedding GuestBook";

// ── Entry Points ──────────────────────────────────────────────

function doPost(e) {
  return handlePost(e);
}

function doGet(e) {
  return handleGet(e);
}

// ── Helpers ───────────────────────────────────────────────────

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// ── POST Handler ──────────────────────────────────────────────

function handlePost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ success: false, message: "Invalid JSON" });
  }

  if (body.type === "rsvp") {
    return handleRSVP(body);
  }

  if (body.type === "guestbook") {
    return handleGuestBookSubmit(body);
  }

  return jsonResponse({ success: false, message: "Unknown type: " + body.type });
}

// ── RSVP ──────────────────────────────────────────────────────

function handleRSVP(body) {
  var name = String(body.name || "").trim();
  var phone = String(body.phone || "").trim();
  var attendance = String(body.attendance || "hadir");
  var guestCount = Number(body.guestCount) || 1;
  var message = String(body.message || "").slice(0, 500);

  if (!name) {
    return jsonResponse({ success: false, message: "Nama wajib diisi." });
  }
  if (!phone) {
    return jsonResponse({ success: false, message: "Nomor telepon wajib diisi." });
  }

  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RSVP_SHEET_NAME);
  if (!sheet) {
    return jsonResponse({
      success: false,
      message: "Sheet '" + RSVP_SHEET_NAME + "' tidak ditemukan.",
    });
  }

  sheet.appendRow([
    new Date().toISOString(),
    name,
    phone,
    attendance,
    guestCount,
    message,
  ]);

  return jsonResponse({
    success: true,
    message: "RSVP berhasil dikirim. Terima kasih!",
  });
}

// ── Guest Book Submit ─────────────────────────────────────────

function handleGuestBookSubmit(body) {
  var name = String(body.name || "").trim();
  var message = String(body.message || "").slice(0, 500);

  if (!name || !message) {
    return jsonResponse({
      success: false,
      message: "Nama dan ucapan wajib diisi.",
    });
  }

  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GUESTBOOK_SHEET_NAME);
  if (!sheet) {
    return jsonResponse({
      success: false,
      message: "Sheet '" + GUESTBOOK_SHEET_NAME + "' tidak ditemukan.",
    });
  }

  sheet.appendRow([new Date().toISOString(), name, message]);

  return jsonResponse({ success: true, message: "Ucapan terkirim!" });
}

// ── GET Handler (Guest Book Reader) ───────────────────────────

function handleGet(e) {
  var params = e.parameter || {};

  if (params.type === "guestbook") {
    var sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GUESTBOOK_SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ success: false, messages: [] });
    }

    var data = sheet.getDataRange().getValues();
    var messages = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      messages.push({
        timestamp: String(row[0] || ""),
        name: String(row[1] || ""),
        message: String(row[2] || ""),
      });
    }

    return jsonResponse({ success: true, messages: messages });
  }

  return jsonResponse({ success: false, messages: [] });
}

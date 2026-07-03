/**
 * Google Apps Script Web App — Wedding RSVP & Guest Book
 *
 * Deployment instructions:
 * 1. Open https://script.google.com and create a new project
 * 2. Paste this entire file
 * 3. Click Deploy → New Deployment → Web App
 * 4. Execute as: Me  |  Who has access: Anyone
 * 5. Copy the deployment URL
 * 6. The spreadsheet is auto-created on the first request.
 *
 * Note: CORS is handled by the Next.js API proxy — no CORS headers needed here.
 */

var RSVP_SHEET_NAME = "Wedding RSVP";
var GUESTBOOK_SHEET_NAME = "Wedding GuestBook";
var SPREADSHEET_ID_PROP = "SPREADSHEET_ID";

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

function sanitizePhone(raw) {
  var phone = String(raw || "").replace(/[\s\-().]/g, "").trim();
  // Normalize +62 / 62 prefix to 08
  if (phone.indexOf("+62") === 0) {
    phone = "0" + phone.slice(3);
  } else if (phone.indexOf("62") === 0 && phone.length >= 10) {
    phone = "0" + phone.slice(2);
  }
  return phone;
}

function isValidPhone(raw) {
  var phone = sanitizePhone(raw);
  if (!phone) return false;
  if (phone.indexOf("08") !== 0) return false;
  if (phone.length < 10 || phone.length > 15) return false;
  if (!/^\d+$/.test(phone)) return false;
  if (/^0+$/.test(phone)) return false;
  return true;
}

function getOrCreateSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(SPREADSHEET_ID_PROP);

  // Already exists
  if (id) {
    var existing = SpreadsheetApp.openById(id);
    if (existing) return existing;
  }

  // Create new spreadsheet on first run
  var ss = SpreadsheetApp.create("Wedding RSVP Data");
  props.setProperty(SPREADSHEET_ID_PROP, ss.getId());

  // Rename default sheet to RSVP
  var defaultSheet = ss.getSheets()[0];
  defaultSheet.setName(RSVP_SHEET_NAME);
  defaultSheet
    .getRange(1, 1, 1, 6)
    .setValues([["Timestamp", "Name", "Phone", "Attendance", "GuestCount", "Message"]]);

  // Create GuestBook sheet
  var guestSheet = ss.insertSheet(GUESTBOOK_SHEET_NAME);
  guestSheet
    .getRange(1, 1, 1, 3)
    .setValues([["Timestamp", "Name", "Message"]]);

  return ss;
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
  var phone = sanitizePhone(body.phone);
  var attendance = String(body.attendance || "hadir");
  var guestCount = Number(body.guestCount) || 1;
  var message = String(body.message || "").slice(0, 500);

  if (!name) return jsonResponse({ success: false, message: "Nama wajib diisi." });
  if (!isValidPhone(body.phone)) return jsonResponse({ success: false, message: "Nomor telepon tidak valid." });

  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName(RSVP_SHEET_NAME);
  if (!sheet) {
    return jsonResponse({ success: false, message: "Sheet tidak ditemukan." });
  }

  sheet.appendRow([new Date().toISOString(), name, phone, attendance, guestCount, message]);

  return jsonResponse({ success: true, message: "RSVP berhasil dikirim. Terima kasih!" });
}

// ── Guest Book Submit ─────────────────────────────────────────

function handleGuestBookSubmit(body) {
  var name = String(body.name || "").trim();
  var message = String(body.message || "").slice(0, 500);

  if (!name || !message) {
    return jsonResponse({ success: false, message: "Nama dan ucapan wajib diisi." });
  }

  var ss = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName(GUESTBOOK_SHEET_NAME);
  if (!sheet) {
    return jsonResponse({ success: false, message: "Sheet tidak ditemukan." });
  }

  sheet.appendRow([new Date().toISOString(), name, message]);

  return jsonResponse({ success: true, message: "Ucapan terkirim!" });
}

// ── GET Handler (Guest Book Reader) ───────────────────────────

function handleGet(e) {
  var params = e.parameter || {};

  if (params.type === "guestbook") {
    var ss = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName(GUESTBOOK_SHEET_NAME);
    if (!sheet) return jsonResponse({ success: false, messages: [] });

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

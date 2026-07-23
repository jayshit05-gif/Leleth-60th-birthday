const SHEET_NAME = "RSVP";
const GUEST_SHEET_NAME = "Guest List";
const TOTAL_GUESTS = 50;

function doGet(e) {
  const params = e.parameter || {};
  const payload = params.action === "guest" ? getGuestBySlug_(params.slug || params.guest || "") : getStats_();

  if (params.callback) {
    return ContentService
      .createTextOutput(params.callback + "(" + JSON.stringify(payload) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const params = e.parameter || {};
  const sheet = getSheet_();
  const submittedAt = params.submittedAt || new Date().toISOString();
  const guest = params.guest || "";
  const attendance = params.attendance || "";
  const guestCount = params.guestCount || "";
  const message = params.message || "";
  const contact = params.contact || "";
  const eventName = params.eventName || "";
  const guestLink = params.guestLink || "";

  upsertGuest_(sheet, {
    submittedAt,
    guest,
    attendance,
    guestCount,
    message,
    contact,
    eventName,
    guestLink
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getStats_() {
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues().slice(1);
  let accepted = 0;
  let declined = 0;

  rows.forEach(function(row) {
    const attendance = String(row[2] || "").toLowerCase();
    const guestCount = Math.max(Number(row[3]) || 1, 1);
    if (attendance === "accepts") accepted += guestCount;
    if (attendance === "declines") declined += 1;
  });

  return {
    totalGuests: TOTAL_GUESTS,
    accepted: accepted,
    declined: declined,
    pendingLabel: "Not Yet Responded",
    note: "Live from Google Sheet."
  };
}

function getGuestBySlug_(slug) {
  const cleanSlug = String(slug || "").trim().toLowerCase();
  if (!cleanSlug) return { ok: false, displayName: "", reason: "missing-slug" };

  const guestTable = getGuestTable_();
  if (!guestTable) return { ok: false, displayName: "", reason: "guest-table-not-found" };

  const values = guestTable.values;
  const slugIndex = guestTable.slugIndex;
  const displayNameIndex = guestTable.displayNameIndex;
  const fullNameIndex = guestTable.fullNameIndex;

  for (let index = 1; index < values.length; index += 1) {
    const rowSlug = String(values[index][slugIndex] || "").trim().toLowerCase();
    if (rowSlug === cleanSlug) {
      return {
        ok: true,
        slug: String(values[index][slugIndex] || "").trim(),
        displayName: String(values[index][displayNameIndex] || "").trim(),
        fullName: fullNameIndex >= 0 ? String(values[index][fullNameIndex] || "").trim() : ""
      };
    }
  }

  return { ok: false, displayName: "", reason: "slug-not-found" };
}

function getGuestTable_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const preferredSheet = spreadsheet.getSheetByName(GUEST_SHEET_NAME) || spreadsheet.getSheetByName("Guests");
  const sheets = preferredSheet ? [preferredSheet] : spreadsheet.getSheets();

  for (let sheetIndex = 0; sheetIndex < sheets.length; sheetIndex += 1) {
    const sheet = sheets[sheetIndex];
    const values = sheet.getDataRange().getValues();
    if (values.length < 2) continue;

    const headers = values[0].map(function(header) {
      return String(header || "").trim().toLowerCase();
    });
    const slugIndex = headers.indexOf("slug");
    const displayNameIndex = headers.indexOf("display name");
    const fullNameIndex = headers.indexOf("guest name / household");

    if (slugIndex >= 0 && displayNameIndex >= 0) {
      return {
        sheetName: sheet.getName(),
        values: values,
        slugIndex: slugIndex,
        displayNameIndex: displayNameIndex,
        fullNameIndex: fullNameIndex
      };
    }
  }

  return null;
}

function upsertGuest_(sheet, data) {
  const values = sheet.getDataRange().getValues();
  const guestKey = String(data.guest || "").trim().toLowerCase();
  let targetRow = -1;

  for (let index = 1; index < values.length; index += 1) {
    if (String(values[index][1] || "").trim().toLowerCase() === guestKey) {
      targetRow = index + 1;
      break;
    }
  }

  const row = [
    data.submittedAt,
    data.guest,
    data.attendance,
    data.guestCount,
    data.message,
    data.contact,
    data.eventName,
    data.guestLink
  ];

  if (targetRow > 0) sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
  else sheet.appendRow(row);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Guest",
      "Attendance",
      "Guest Count",
      "Birthday Message",
      "Contact Number",
      "Event Name",
      "Guest Link"
    ]);
  }

  return sheet;
}

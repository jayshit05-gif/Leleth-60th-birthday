const SHEET_NAME = "RSVP";
const TOTAL_GUESTS = 50;

function doGet(e) {
  const params = e.parameter || {};
  const stats = getStats_();

  if (params.callback) {
    return ContentService
      .createTextOutput(params.callback + "(" + JSON.stringify(stats) + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(stats))
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

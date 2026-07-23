const SHEET_NAME = "RSVP";
const GUEST_SHEET_NAME = "Guest List";
const TOTAL_GUESTS = 50;
const GUEST_SLUG_ALIASES = {
  "sk-parent": "Leberato & Ferdoniza",
  "sk-parents": "Leberato & Ferdoniza",
  "leberato-ferdoniza": "Leberato & Ferdoniza",
  "leberato-and-ferdoniza": "Leberato & Ferdoniza",
  "haydee-parent": "Mustiola & Avelino",
  "haydee-parents": "Mustiola & Avelino",
  "mustiola-avelino": "Mustiola & Avelino",
  "mustiola-and-avelino": "Mustiola & Avelino"
};

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
  const cleanSlug = normalizeGuestKey_(slug);
  if (!cleanSlug) return { ok: false, displayName: "", reason: "missing-slug" };

  const guestTable = getGuestTable_();
  if (!guestTable) return { ok: false, displayName: "", reason: "guest-table-not-found" };

  const values = guestTable.values;
  const slugIndex = guestTable.slugIndex;
  const displayNameIndex = guestTable.displayNameIndex;
  const fullNameIndex = guestTable.fullNameIndex;
  const aliasDisplayName = GUEST_SLUG_ALIASES[cleanSlug] || "";
  const aliasKey = normalizeGuestKey_(aliasDisplayName);

  if (aliasDisplayName) {
    for (let index = 1; index < values.length; index += 1) {
      const rowSlug = String(values[index][slugIndex] || "").trim();
      const displayName = String(values[index][displayNameIndex] || "").trim();
      const fullName = fullNameIndex >= 0 ? String(values[index][fullNameIndex] || "").trim() : "";
      const rowKeys = [rowSlug, displayName, fullName].map(normalizeGuestKey_).filter(Boolean);

      if (rowKeys.indexOf(aliasKey) >= 0) {
        return {
          ok: true,
          slug: rowSlug,
          displayName: displayName || aliasDisplayName,
          fullName: fullName
        };
      }
    }

    return {
      ok: true,
      slug: String(slug || "").trim(),
      displayName: aliasDisplayName,
      fullName: aliasDisplayName
    };
  }

  for (let index = 1; index < values.length; index += 1) {
    const rowSlug = String(values[index][slugIndex] || "").trim();
    const displayName = String(values[index][displayNameIndex] || "").trim();
    const fullName = fullNameIndex >= 0 ? String(values[index][fullNameIndex] || "").trim() : "";
    const rowKeys = [
      rowSlug,
      displayName,
      fullName
    ].map(normalizeGuestKey_).filter(Boolean);

    if (rowKeys.indexOf(cleanSlug) >= 0 || (aliasKey && rowKeys.indexOf(aliasKey) >= 0)) {
      return {
        ok: true,
        slug: rowSlug,
        displayName: displayName || aliasDisplayName,
        fullName: fullName
      };
    }
  }

  return { ok: false, displayName: "", reason: "slug-not-found" };
}

function normalizeGuestKey_(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
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

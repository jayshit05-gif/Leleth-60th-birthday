import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "C:/Users/jay/Downloads/moumeants-and-frames-FIXED/outputs/mom-60th-rsvp";
const outputPath = `${outputDir}/leleth-60th-birthday-rsvp-tracker.xlsx`;
const guestCsvPath = "C:/Users/jay/Downloads/leleth_60th_guest_database - Guests (1).csv";

const workbook = Workbook.create();
workbook.comments.setSelf({ displayName: "User" });

const dashboard = workbook.worksheets.add("Dashboard");
const rsvp = workbook.worksheets.add("RSVP");
const guestList = workbook.worksheets.add("Guest List");
const setup = workbook.worksheets.add("Setup");

const colors = {
  black: "#101010",
  ink: "#171717",
  silver: "#D6D8D8",
  softSilver: "#F2F3F3",
  pale: "#FAFAF8",
  line: "#C9CCCC",
  accept: "#DFF3E7",
  decline: "#F7DEDE",
  pending: "#EFEFEF",
  gold: "#B8904A",
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const cleanText = text.replace(/^\uFEFF/, "");

  for (let index = 0; index < cleanText.length; index += 1) {
    const char = cleanText[index];
    const next = cleanText[index + 1];
    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((value) => value !== "")) rows.push(row);

  const [headers, ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(headers.map((header, index) => [header, record[index] || ""]))
  );
}

const guestRecords = parseCsv(await fs.readFile(guestCsvPath, "utf8"));
const plannedGuestCount = guestRecords.reduce(
  (sum, row) => sum + (Number(row["Max Guests"]) || 0),
  0
);
const guestTableRows = 200;

function applySheetBase(sheet) {
  sheet.showGridLines = false;
  sheet.getRange("A1:K120").format = {
    font: { name: "Aptos", color: colors.ink, size: 10 },
  };
}

[dashboard, rsvp, guestList, setup].forEach(applySheetBase);

setup.getRange("A1:E1").merge();
setup.getRange("A1").values = [["Leleth's 60th Birthday - RSVP Setup"]];
setup.getRange("A1").format = {
  fill: colors.black,
  font: { bold: true, color: "#FFFFFF", size: 16 },
  horizontalAlignment: "center",
};
setup.getRange("A3:B13").values = [
  ["Event Name", "Leleth's 60th Birthday"],
  ["Event Date", new Date("2026-08-22T00:00:00")],
  ["Start Time", "4:00 PM"],
  ["End Time", "10:00 PM"],
  ["Venue", "The Glass Garden"],
  ["Venue Address", "257 Evangelista Ave, Pasig, Metro Manila"],
  ["RSVP Deadline", new Date("2026-08-03T00:00:00")],
  ["Target Guest Capacity", plannedGuestCount],
  ["Invitation Hashtag", "#LelethThePartyBegins"],
  ["Apps Script Sheet Name", "RSVP"],
  ["Status Values", "Accepts, Declines, Pending"],
];
setup.getRange("A3:A13").format = {
  fill: colors.softSilver,
  font: { bold: true },
};
setup.getRange("B4:B6").format.wrapText = true;
setup.getRange("B4:B6").format.horizontalAlignment = "left";
setup.getRange("B4:B6").format.verticalAlignment = "center";
setup.getRange("B4:B6").format.rowHeight = 28;
setup.getRange("B4:B6").format.numberFormat = "@";
setup.getRange("B4").format.numberFormat = "mmm d, yyyy";
setup.getRange("B9").format.numberFormat = "mmm d, yyyy";
setup.getRange("B10").format.numberFormat = "0";
setup.getRange("B4:B8").format.wrapText = true;
setup.getRange("B4:B8").format.columnWidth = 36;
setup.getRange("B4:B8").format.rowHeight = 26;
setup.getRange("B4:B8").format.borders = { preset: "outside", style: "thin", color: colors.line };
setup.getRange("B4:B8").format.wrapText = true;
setup.getRange("B4:B8").format.font = { color: colors.ink };
setup.getRange("B4:B8").format.fill = "#FFFFFF";
setup.getRange("B4:B8").format.verticalAlignment = "center";
setup.getRange("B4:B8").format.horizontalAlignment = "left";
setup.getRange("B4:B8").format.numberFormat = "@";
setup.getRange("B4:B8").format.rowHeight = 28;
setup.getRange("B4:B8").format.columnWidth = 34;
setup.getRange("B4:B8").format.borders = { preset: "inside", style: "thin", color: "#E7E7E7" };
setup.getRange("B4:B8").format.borders = { preset: "outside", style: "thin", color: colors.line };
setup.getRange("B4:B8").format.wrapText = true;
setup.getRange("B4:B8").format.verticalAlignment = "center";
setup.getRange("B4:B8").format.horizontalAlignment = "left";
setup.getRange("B4:B8").format.font = { color: colors.ink };
setup.getRange("B4:B8").format.fill = "#FFFFFF";
setup.getRange("B4:B8").format.numberFormat = "@";
setup.getRange("B4:B8").format.rowHeight = 28;
setup.getRange("B4:B8").format.columnWidth = 34;
setup.getRange("B4:B8").format.borders = { preset: "inside", style: "thin", color: "#E7E7E7" };
setup.getRange("B4:B8").format.borders = { preset: "outside", style: "thin", color: colors.line };
setup.getRange("B4:B8").format.wrapText = true;
setup.getRange("B4:B8").format.verticalAlignment = "center";
setup.getRange("B4:B8").format.horizontalAlignment = "left";
setup.getRange("B4:B8").format.font = { color: colors.ink };
setup.getRange("B4:B8").format.fill = "#FFFFFF";
setup.getRange("B4:B8").format.numberFormat = "@";
setup.getRange("A3:B13").format.borders = {
  insideHorizontal: { style: "thin", color: "#E4E4E4" },
  insideVertical: { style: "thin", color: "#E4E4E4" },
  top: { style: "thin", color: colors.line },
  bottom: { style: "thin", color: colors.line },
  left: { style: "thin", color: colors.line },
  right: { style: "thin", color: colors.line },
};
setup.getRange("B4:B6").format.numberFormat = "@";
setup.getRange("B4:B6").format.wrapText = true;
setup.getRange("B4:B6").format.rowHeight = 28;
setup.getRange("B4:B6").format.columnWidth = 36;
setup.getRange("B4:B6").format.horizontalAlignment = "left";
setup.getRange("B4:B6").format.verticalAlignment = "center";
setup.getRange("B4:B6").format.fill = "#FFFFFF";
setup.getRange("B4:B6").format.font = { color: colors.ink };
setup.getRange("B4:B6").format.borders = { preset: "inside", style: "thin", color: "#E7E7E7" };
setup.getRange("B4:B6").format.borders = { preset: "outside", style: "thin", color: colors.line };
setup.getRange("B4:B6").format.wrapText = true;
setup.getRange("B4:B6").format.verticalAlignment = "center";
setup.getRange("B4:B6").format.horizontalAlignment = "left";
setup.getRange("B4:B6").format.font = { color: colors.ink };
setup.getRange("B4:B6").format.fill = "#FFFFFF";
setup.getRange("B4:B6").format.numberFormat = "@";
setup.getRange("B4:B6").format.rowHeight = 28;
setup.getRange("B4:B6").format.columnWidth = 36;
setup.getRange("B4:B6").format.borders = { preset: "inside", style: "thin", color: "#E7E7E7" };
setup.getRange("B4:B6").format.borders = { preset: "outside", style: "thin", color: colors.line };
setup.getRange("B4:B6").format.wrapText = true;
setup.getRange("B4:B6").format.verticalAlignment = "center";
setup.getRange("B4:B6").format.horizontalAlignment = "left";
setup.getRange("B4:B6").format.font = { color: colors.ink };
setup.getRange("B4:B6").format.fill = "#FFFFFF";
setup.getRange("B4:B6").format.numberFormat = "@";
setup.getRange("B4:B6").format.rowHeight = 28;
setup.getRange("B4:B6").format.columnWidth = 36;
setup.getRange("B4:B6").format.borders = { preset: "inside", style: "thin", color: "#E7E7E7" };
setup.getRange("B4:B6").format.borders = { preset: "outside", style: "thin", color: colors.line };
setup.getRange("D3:E9").values = [
  ["Google Sheet Setup", ""],
  ["1", "Upload/import this workbook into Google Sheets."],
  ["2", "Open Extensions > Apps Script."],
  ["3", "Paste the RSVP script from the invitation template."],
  ["4", "Deploy as Web App and paste the URL into config.js."],
  ["5", "Keep the RSVP tab name and headers unchanged."],
  ["6", "Use Guest List for planning and RSVP for form responses."],
];
setup.getRange("D3:E3").merge();
setup.getRange("D3").format = {
  fill: colors.black,
  font: { bold: true, color: "#FFFFFF" },
};
setup.getRange("D4:D9").format = {
  fill: colors.softSilver,
  font: { bold: true },
  horizontalAlignment: "center",
};
setup.getRange("E4:E9").format.wrapText = true;
setup.getRange("D3:E9").format.borders = { preset: "all", style: "thin", color: colors.line };
setup.getRange("A:A").format.columnWidth = 24;
setup.getRange("B:B").format.columnWidth = 40;
setup.getRange("D:D").format.columnWidth = 8;
setup.getRange("E:E").format.columnWidth = 55;
setup.getRange("B4").format.numberFormat = "mmm d, yyyy";
setup.getRange("B9").format.numberFormat = "mmm d, yyyy";
setup.freezePanes.freezeRows(1);

rsvp.getRange("A1:H1").values = [[
  "Submitted At",
  "Guest",
  "Attendance",
  "Guest Count",
  "Birthday Message",
  "Contact Number",
  "Event Name",
  "Guest Link",
]];
rsvp.getRange("A1:H1").format = {
  fill: colors.black,
  font: { bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
};
rsvp.getRange("A2:H200").values = Array.from({ length: 199 }, () => [null, "", "", null, "", "", "", ""]);
rsvp.getRange("A2:A200").format.numberFormat = "yyyy-mm-dd hh:mm";
rsvp.getRange("D2:D200").format.numberFormat = "0";
rsvp.getRange("A:H").format.columnWidth = 18;
rsvp.getRange("B:B").format.columnWidth = 34;
rsvp.getRange("E:E").format.columnWidth = 40;
rsvp.getRange("H:H").format.columnWidth = 50;
rsvp.getRange("A1:H200").format.borders = {
  insideHorizontal: { style: "thin", color: "#E7E7E7" },
  top: { style: "thin", color: colors.line },
  bottom: { style: "thin", color: colors.line },
  left: { style: "thin", color: colors.line },
  right: { style: "thin", color: colors.line },
};
rsvp.getRange("C2:C200").dataValidation = { rule: { type: "list", values: ["Accepts", "Declines", "Pending"] } };
rsvp.getRange("D2:D200").dataValidation = { rule: { type: "whole", operator: "between", formula1: 1, formula2: 10 } };
rsvp.getRange("E2:E200").format.wrapText = true;
rsvp.freezePanes.freezeRows(1);
const rsvpTable = rsvp.tables.add("A1:H200", true, "RSVPResponses");
rsvpTable.style = "TableStyleLight1";

guestList.getRange("A1:N1").values = [[
  "Invite ID",
  "Slug",
  "Group",
  "Guest Name / Household",
  "Display Name",
  "Max Guests",
  "Source RSVP Status",
  "Source Attending Count",
  "Source Message",
  "Notes",
  "Personalized Link",
  "Live RSVP Status",
  "Live Attending Count",
  "Last Updated",
]];
guestList.getRange("A1:N1").format = {
  fill: colors.black,
  font: { bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
};
const guestValues = Array.from({ length: guestTableRows - 1 }, (_, index) => {
  const row = guestRecords[index];
  if (!row) return ["", "", "", "", "", null, "", null, "", "", "", "", null, ""];
  const displayName = row["Display Name"] || row["Guest Name / Household"] || "";
  const cleanLink = `https://YOUR-DOMAIN.com/?guest=${encodeURIComponent(displayName).replaceAll("%20", "+")}`;
  return [
    row["Invite ID"],
    row["Slug"],
    row["Group"],
    row["Guest Name / Household"],
    displayName,
    Number(row["Max Guests"]) || null,
    row["RSVP Status"] || "Pending",
    Number(row["Attending Count"]) || null,
    row["Message"],
    row["Notes"],
    cleanLink,
    "",
    null,
    "",
  ];
});
guestList.getRange("A2:N200").values = guestValues;
guestList.getRange("L2").formulas = [[
  "=IF(E2=\"\",\"\",IF(COUNTIFS(RSVP!$B$2:$B$200,E2,RSVP!$C$2:$C$200,\"accepts\")+COUNTIFS(RSVP!$B$2:$B$200,B2,RSVP!$C$2:$C$200,\"accepts\")+COUNTIFS(RSVP!$B$2:$B$200,E2,RSVP!$C$2:$C$200,\"Accepts\")+COUNTIFS(RSVP!$B$2:$B$200,B2,RSVP!$C$2:$C$200,\"Accepts\")>0,\"Accepts\",IF(COUNTIFS(RSVP!$B$2:$B$200,E2,RSVP!$C$2:$C$200,\"declines\")+COUNTIFS(RSVP!$B$2:$B$200,B2,RSVP!$C$2:$C$200,\"declines\")+COUNTIFS(RSVP!$B$2:$B$200,E2,RSVP!$C$2:$C$200,\"Declines\")+COUNTIFS(RSVP!$B$2:$B$200,B2,RSVP!$C$2:$C$200,\"Declines\")>0,\"Declines\",G2)))",
]];
guestList.getRange("L2:L200").fillDown();
guestList.getRange("M2").formulas = [[
  "=IF(E2=\"\",\"\",IF(L2=\"Accepts\",IFERROR(INDEX(RSVP!$D$2:$D$200,MATCH(E2,RSVP!$B$2:$B$200,0)),IFERROR(INDEX(RSVP!$D$2:$D$200,MATCH(B2,RSVP!$B$2:$B$200,0)),F2)),0))",
]];
guestList.getRange("M2:M200").fillDown();
guestList.getRange("N2").formulas = [[
  "=IF(E2=\"\",\"\",IFERROR(INDEX(RSVP!$A$2:$A$200,MATCH(E2,RSVP!$B$2:$B$200,0)),IFERROR(INDEX(RSVP!$A$2:$A$200,MATCH(B2,RSVP!$B$2:$B$200,0)),\"\")))",
]];
guestList.getRange("N2:N200").fillDown();
guestList.getRange("F2:F200").format.numberFormat = "0";
guestList.getRange("H2:H200").format.numberFormat = "0";
guestList.getRange("M2:M200").format.numberFormat = "0";
guestList.getRange("N2:N200").format.numberFormat = "yyyy-mm-dd hh:mm";
guestList.getRange("C2:C200").dataValidation = { rule: { type: "list", values: ["Friends / Colleagues", "Agusan Family", "Allaba Family", "Lamanilao Siblings", "Other"] } };
guestList.getRange("G2:G200").dataValidation = { rule: { type: "list", values: ["Accepts", "Declines", "Pending"] } };
guestList.getRange("L2:L200").dataValidation = { rule: { type: "list", values: ["Accepts", "Declines", "Pending"] } };
guestList.getRange("A:N").format.columnWidth = 16;
guestList.getRange("B:B").format.columnWidth = 26;
guestList.getRange("D:E").format.columnWidth = 34;
guestList.getRange("J:J").format.columnWidth = 44;
guestList.getRange("K:K").format.columnWidth = 55;
guestList.getRange("A1:N200").format.borders = {
  insideHorizontal: { style: "thin", color: "#E7E7E7" },
  top: { style: "thin", color: colors.line },
  bottom: { style: "thin", color: colors.line },
  left: { style: "thin", color: colors.line },
  right: { style: "thin", color: colors.line },
};
guestList.freezePanes.freezeRows(1);
const guestTable = guestList.tables.add("A1:N200", true, "GuestList");
guestTable.style = "TableStyleLight1";

dashboard.getRange("A1:H1").merge();
dashboard.getRange("A1").values = [["Leleth's 60th Birthday RSVP Dashboard"]];
dashboard.getRange("A1").format = {
  fill: colors.black,
  font: { bold: true, color: "#FFFFFF", size: 18 },
  horizontalAlignment: "center",
};
dashboard.getRange("A3:A8").values = [
  ["Event Date"],
  ["Venue"],
  ["RSVP Deadline"],
  ["Target Capacity"],
  ["Hashtag"],
  ["Sheet Status"],
];
dashboard.getRange("B3:B7").formulas = [
  ["='Setup'!B4"],
  ["='Setup'!B7"],
  ["='Setup'!B9"],
  ["='Setup'!B10"],
  ["='Setup'!B11"],
];
dashboard.getRange("B8").values = [["Ready for Google Sheets"]];
dashboard.getRange("A3:A8").format = { fill: colors.softSilver, font: { bold: true } };
dashboard.getRange("A3:B8").format.borders = { preset: "all", style: "thin", color: colors.line };
dashboard.getRange("B3:B5").format.wrapText = true;
dashboard.getRange("B3").format.numberFormat = "mmm d, yyyy";
dashboard.getRange("B5").format.numberFormat = "mmm d, yyyy";

dashboard.getRange("D3:E8").values = [
  ["Metric", "Count"],
  ["Accepted Guests", null],
  ["Declined Invitees", null],
  ["Pending Invitees", null],
  ["Total Planned Invitees", null],
  ["Remaining Capacity", null],
];
dashboard.getRange("E4:E8").formulas = [
  ["=SUMIF('Guest List'!$L$2:$L$200,\"Accepts\",'Guest List'!$M$2:$M$200)"],
  ["=COUNTIFS('Guest List'!$E$2:$E$200,\"<>\",'Guest List'!$L$2:$L$200,\"Declines\")"],
  ["=COUNTIFS('Guest List'!$E$2:$E$200,\"<>\",'Guest List'!$L$2:$L$200,\"Pending\")"],
  ["=SUM('Guest List'!$F$2:$F$200)"],
  ["='Setup'!B10-E4"],
];
dashboard.getRange("D3:E3").format = {
  fill: colors.black,
  font: { bold: true, color: "#FFFFFF" },
};
dashboard.getRange("D4:D8").format = { fill: colors.softSilver, font: { bold: true } };
dashboard.getRange("E4:E8").format = {
  fill: "#FFFFFF",
  font: { bold: true, size: 14, color: colors.ink },
  numberFormat: "0",
  horizontalAlignment: "center",
};
dashboard.getRange("D3:E8").format.borders = { preset: "all", style: "thin", color: colors.line };

dashboard.getRange("A11:H11").merge();
dashboard.getRange("A11").values = [["Next Actions"]];
dashboard.getRange("A11").format = {
  fill: colors.black,
  font: { bold: true, color: "#FFFFFF" },
};
dashboard.getRange("A12:H16").merge(true);
dashboard.getRange("A12:A16").values = [
  ["1. Add the final invitee names and counts in Guest List."],
  ["2. Import this workbook into Google Sheets, then paste/deploy the Apps Script."],
  ["3. Paste the deployed Web App URL into config.js under rsvpTracker.appsScriptUrl."],
  ["4. Replace the invitation RSVP link and QR code once the final website URL is ready."],
  ["5. Keep RSVP tab headers unchanged so the website can submit responses correctly."],
];
dashboard.getRange("A12:H16").format = {
  fill: colors.pale,
  wrapText: true,
  borders: { preset: "outside", style: "thin", color: colors.line },
};
dashboard.getRange("A12:H16").format.rowHeight = 28;
dashboard.getRange("A:H").format.columnWidth = 18;
dashboard.getRange("A:A").format.columnWidth = 22;
dashboard.getRange("B:B").format.columnWidth = 34;
dashboard.getRange("D:D").format.columnWidth = 24;
dashboard.getRange("E:E").format.columnWidth = 18;
dashboard.freezePanes.freezeRows(1);

guestList.getRange("L2:L200").conditionalFormats.add("containsText", {
  text: "Accepts",
  format: { fill: colors.accept, font: { color: "#0E5132" } },
});
guestList.getRange("L2:L200").conditionalFormats.add("containsText", {
  text: "Declines",
  format: { fill: colors.decline, font: { color: "#7A1F1F" } },
});
guestList.getRange("L2:L200").conditionalFormats.add("containsText", {
  text: "Pending",
  format: { fill: colors.pending, font: { color: "#555555" } },
});
rsvp.getRange("C2:C200").conditionalFormats.add("containsText", {
  text: "Accepts",
  format: { fill: colors.accept, font: { color: "#0E5132" } },
});
rsvp.getRange("C2:C200").conditionalFormats.add("containsText", {
  text: "Declines",
  format: { fill: colors.decline, font: { color: "#7A1F1F" } },
});
rsvp.getRange("C2:C200").conditionalFormats.add("containsText", {
  text: "Pending",
  format: { fill: colors.pending, font: { color: "#555555" } },
});

workbook.comments.addThread(
  { cell: rsvp.getRange("A1") },
  "Do not rename this sheet or change these headers if using the included Apps Script."
);
workbook.comments.addThread(
  { cell: setup.getRange("E7") },
  "After Apps Script deployment, paste the Web App URL into event-invitation-template/config.js under rsvpTracker.appsScriptUrl."
);

const inspect = await workbook.inspect({
  kind: "table",
  range: "Dashboard!A1:H16",
  include: "values,formulas",
  tableMaxRows: 20,
  tableMaxCols: 10,
});
console.log(inspect.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 300 },
  summary: "final formula error scan",
});
console.log(errors.ndjson);

for (const name of ["Dashboard", "RSVP", "Guest List", "Setup"]) {
  const preview = await workbook.render({
    sheetName: name,
    autoCrop: "all",
    scale: 1,
    format: "png",
  });
  await fs.writeFile(
    `${outputDir}/${name.toLowerCase().replaceAll(" ", "-")}.png`,
    new Uint8Array(await preview.arrayBuffer())
  );
}

await fs.mkdir(outputDir, { recursive: true });
const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(outputPath);
console.log(outputPath);

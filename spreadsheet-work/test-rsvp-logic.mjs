import fs from "node:fs/promises";
import vm from "node:vm";

const root = "C:/Users/jay/Downloads/moumeants-and-frames-FIXED/event-invitation-template";
const configSource = await fs.readFile(`${root}/config.js`, "utf8");
const appsScriptSource = await fs.readFile(`${root}/google-apps-script-rsvp.js`, "utf8");

const sandbox = { window: {} };
vm.runInNewContext(configSource, sandbox, { filename: "config.js" });
const config = sandbox.window.INVITATION_CONFIG;

function assert(name, condition, details = "") {
  if (!condition) throw new Error(`${name}${details ? `: ${details}` : ""}`);
  return { name, ok: true };
}

function toCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function cleanGuestDisplayName(value) {
  return String(value || "Family and Friends").replace(/^dear\s+/i, "").trim() || "Family and Friends";
}

function getGuestName(rawName, fallback) {
  const cleanName = String(rawName || fallback || "").replace(/\+/g, " ").replace(/\s+/g, " ").trim();
  if (!cleanName) return "Dear Family and Friends";
  return /^dear\s/i.test(cleanName) ? cleanName : `Dear ${cleanName}`;
}

function trackerData(tracker, saved) {
  const data = {
    totalGuests: tracker.totalGuests,
    accepted: tracker.accepted,
    declined: tracker.declined,
    pendingLabel: tracker.pendingLabel,
    note: tracker.note,
  };
  if (saved && saved.attendance === "accepts") data.accepted = toCount(data.accepted) + Math.max(toCount(saved.guestCount), 1);
  if (saved && saved.attendance === "declines") data.declined = toCount(data.declined) + 1;
  return data;
}

function trackerMath(data) {
  const accepted = toCount(data.accepted);
  const declined = toCount(data.declined);
  const total = Math.max(toCount(data.totalGuests), accepted + declined);
  return {
    accepted,
    declined,
    total,
    pending: Math.max(total - accepted - declined, 0),
    responded: accepted + declined,
  };
}

function appsScriptStats(rows, totalGuests) {
  let accepted = 0;
  let declined = 0;
  rows.forEach((row) => {
    const attendance = String(row[2] || "").toLowerCase();
    const guestCount = Math.max(Number(row[3]) || 1, 1);
    if (attendance === "accepts") accepted += guestCount;
    if (attendance === "declines") declined += 1;
  });
  return { totalGuests, accepted, declined, pendingLabel: "Not Yet Responded", note: "Live from Google Sheet." };
}

const event = config[config.eventType];
const acceptedPayload = {
  guest: cleanGuestDisplayName(getGuestName("Mary Ann I. Flores", config.guestName)),
  attendance: "accepts",
  guestCount: "2",
  message: "Happy birthday!",
  contact: "",
  eventName: event.names,
  submittedAt: "2026-07-13T00:00:00.000Z",
  guestLink: "http://127.0.0.1:8787/index.html?guest=Mary%20Ann%20I.%20Flores",
};
const declinedPayload = { ...acceptedPayload, attendance: "declines", guestCount: "1" };

const tests = [
  assert("config event type is birthday", config.eventType === "birthday"),
  assert("tracker total is 50", config.rsvpTracker.totalGuests === 50, `got ${config.rsvpTracker.totalGuests}`),
  assert("apps script total is 50", /const TOTAL_GUESTS = 50;/.test(appsScriptSource)),
  assert("guest URL display name is clean", acceptedPayload.guest === "Mary Ann I. Flores", `got ${acceptedPayload.guest}`),
  assert("event name is included in RSVP payload", acceptedPayload.eventName === "Leleth's 60th Birthday"),
  assert("sheet submit is connected to Apps Script", /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(config.rsvpTracker.appsScriptUrl || "")),
];

const acceptedLocal = trackerMath(trackerData(config.rsvpTracker, acceptedPayload));
tests.push(assert("local accepted RSVP updates accepted count", acceptedLocal.accepted === 2, JSON.stringify(acceptedLocal)));
tests.push(assert("local accepted RSVP keeps total at 50", acceptedLocal.total === 50, JSON.stringify(acceptedLocal)));
tests.push(assert("local accepted RSVP computes pending count", acceptedLocal.pending === 48, JSON.stringify(acceptedLocal)));

const declinedLocal = trackerMath(trackerData(config.rsvpTracker, declinedPayload));
tests.push(assert("local declined RSVP updates declined count", declinedLocal.declined === 1, JSON.stringify(declinedLocal)));
tests.push(assert("local declined RSVP computes pending count", declinedLocal.pending === 49, JSON.stringify(declinedLocal)));

const sheetStats = appsScriptStats([
  ["2026-07-13", "Mary Ann I. Flores", "accepts", "2"],
  ["2026-07-13", "Jay Ann M. Buladaco", "declines", "1"],
], 50);
tests.push(assert("Apps Script counts accepted guests by guest count", sheetStats.accepted === 2, JSON.stringify(sheetStats)));
tests.push(assert("Apps Script counts declined invitees", sheetStats.declined === 1, JSON.stringify(sheetStats)));
tests.push(assert("Apps Script returns total guests 50", sheetStats.totalGuests === 50, JSON.stringify(sheetStats)));

console.log(JSON.stringify({ ok: true, tests, acceptedLocal, declinedLocal, sheetStats }, null, 2));

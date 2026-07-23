import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const requiredFiles = [
  "index.html",
  "config.js",
  "css/style.css",
  "js/script.js",
  "vercel.json"
];
const forbiddenPaths = [".openai", "dist", "sites-native-deploy", "site-deploy.tar.gz"];
const errors = [];
const warnings = [];

const exists = (filePath) => fs.existsSync(path.join(root, filePath));

for (const file of requiredFiles) {
  if (!exists(file)) errors.push(`Missing required file: ${file}`);
}

for (const file of forbiddenPaths) {
  if (exists(file)) errors.push(`Remove ChatGPT Sites deploy artifact before Vercel push: ${file}`);
}

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

let config;
try {
  const sandbox = { window: {} };
  vm.runInNewContext(read("config.js"), sandbox, { filename: "config.js" });
  config = sandbox.window.INVITATION_CONFIG;
} catch (error) {
  errors.push(`config.js could not be evaluated: ${error.message}`);
}

function collectAssets(value, out = []) {
  if (!value) return out;
  if (typeof value === "string") {
    if (/^(assets\/|css\/|js\/|favicon\.svg)/.test(value)) out.push(value.split("#")[0].split("?")[0]);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectAssets(item, out));
    return out;
  }
  if (typeof value === "object") {
    Object.values(value).forEach((item) => collectAssets(item, out));
  }
  return out;
}

if (config) {
  if (config.eventType !== "birthday") warnings.push(`eventType is ${JSON.stringify(config.eventType)}, expected "birthday" for this project.`);

  const trackerUrl = config.rsvpTracker?.appsScriptUrl || "";
  if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(trackerUrl)) {
    errors.push("rsvpTracker.appsScriptUrl must be a deployed Google Apps Script Web App URL.");
  }

  const urlsToCheck = [config.rsvpLink, config.guestLink].filter(Boolean);
  for (const url of urlsToCheck) {
    if (/example\.com|YOUR-DOMAIN|localhost|127\.0\.0\.1|file:\/\//i.test(url)) {
      errors.push(`Replace placeholder or local URL in config.js: ${url}`);
    }
  }

  const assetRefs = [...new Set(collectAssets(config))];
  for (const asset of assetRefs) {
    if (!exists(asset)) errors.push(`Missing configured asset: ${asset}`);
  }

  if (config.images?.qrCode && /placeholder/i.test(config.images.qrCode)) {
    warnings.push("QR code is still the placeholder. Replace it after the final Vercel URL is live.");
  }
}

const scannedFiles = ["index.html", "config.js", "js/script.js", "css/style.css", "README.md", "vercel.json"].filter(exists);
for (const file of scannedFiles) {
  const body = read(file);
  if (/chatgpt\.site|allwaysjay|\.openai|sites-native|vinext/i.test(body)) {
    errors.push(`ChatGPT Sites-specific reference found in ${file}`);
  }
}

if (warnings.length) {
  console.log("Warnings:");
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length) {
  console.error("Vercel readiness check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Vercel readiness check passed.");

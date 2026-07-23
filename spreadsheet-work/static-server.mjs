import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const root = "C:/Users/jay/Downloads/moumeants-and-frames-FIXED/event-invitation-template";
const port = 8787;
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".mp3": "audio/mpeg",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const fullPath = path.resolve(root, `.${requested}`);
    if (!fullPath.startsWith(path.resolve(root))) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    const data = await fs.readFile(fullPath);
    res.writeHead(200, { "Content-Type": types[path.extname(fullPath).toLowerCase()] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving invitation on http://127.0.0.1:${port}`);
});

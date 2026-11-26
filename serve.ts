// Server statis kecil untuk uji lokal: menyajikan app/ di port 8080.
// Jalankan: node serve.ts [--port 8080]
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "app");
const port = Number(process.argv.find((a) => a.startsWith("--port="))?.split("=")[1] || 8080);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" };

const server = createServer(async (req, res) => {
  const path = normalize(join(root, decodeURIComponent(req.url.split("?")[0] || "/")));
  if (!path.startsWith(root)) { res.writeHead(403); res.end("forbidden"); return; }
  const file = path.endsWith("/") ? join(path, "index.html") : path;
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404); res.end("not found");
  }
});
server.listen(port, () => console.log("Serving app/ on port " + port));

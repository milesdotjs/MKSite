// Serves a folder of generated sites over http so they can be clicked through
// the way a host would serve them. Folders without an index.html get a
// listing. Usage: node scripts/qa-serve.cjs <folder> [port]
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || "qa-shots");
const port = Number(process.argv[3] || 4323);
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".zip": "application/zip",
};

function listing(dir, urlPath) {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const rows = entries
    .map((e) => {
      const name = e.name + (e.isDirectory() ? "/" : "");
      const isSite = e.isDirectory() && fs.existsSync(path.join(dir, e.name, "index.html"));
      return `<li><a href="${encodeURIComponent(e.name)}${e.isDirectory() ? "/" : ""}">${name}</a>${isSite ? " <em>(site)</em>" : ""}</li>`;
    })
    .join("\n");
  return `<!doctype html><meta charset="utf-8"><title>${urlPath}</title>
<style>body{font:16px/1.5 system-ui;margin:2rem;max-width:60ch}em{color:#666}</style>
<h1>${urlPath}</h1><ul>${urlPath !== "/" ? '<li><a href="../">../</a></li>' : ""}${rows}</ul>`;
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const full = path.join(root, urlPath);
    if (!full.startsWith(root) || !fs.existsSync(full)) {
      res.writeHead(404, { "content-type": "text/plain" });
      return res.end("not found");
    }
    if (fs.statSync(full).isDirectory()) {
      if (!urlPath.endsWith("/")) {
        res.writeHead(302, { location: urlPath + "/" });
        return res.end();
      }
      const index = path.join(full, "index.html");
      if (fs.existsSync(index)) {
        res.writeHead(200, { "content-type": MIME[".html"] });
        return fs.createReadStream(index).pipe(res);
      }
      res.writeHead(200, { "content-type": MIME[".html"] });
      return res.end(listing(full, urlPath));
    }
    res.writeHead(200, { "content-type": MIME[path.extname(full).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(full).pipe(res);
  })
  .listen(port, "127.0.0.1", () => console.log(`serving ${root} at http://127.0.0.1:${port}/`));

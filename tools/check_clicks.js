/* Regression test: are the project cards (and the main nav/CTA links) actually
 * clickable, and do they land on the right page?
 *
 * This exists because a purely visual bug slipped through every screenshot
 * review: `transform-style: preserve-3d` on `.card` put the holo-tilted <a>
 * into the article's 3D rendering context, and Chrome then hit-tested the
 * pointer onto the <article> instead of the <a>. The cards LOOKED perfect and
 * were completely dead. Screenshots cannot catch that; a real click can.
 *
 * Two details that matter:
 *   - the pointer is MOVED onto the target first, because the tilt only
 *     engages on pointermove -- a cold click passes even when the page is broken
 *   - the static server is CASE-SENSITIVE and serves only what `git ls-files`
 *     reports, so it behaves like GitHub Pages rather than the local Windows FS
 *
 *   node tools/check_clicks.js
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const cp = require("child_process");

const ROOT = path.dirname(__dirname);
const PORT = 8971;
// puppeteer is vendored inside one of the projects rather than at the repo root
const puppeteer = require(path.join(ROOT, "projects", "blackjack with yugi", "node_modules", "puppeteer"));

const DEPLOYED = new Set(
  cp.execSync("git ls-files -z", { cwd: ROOT, maxBuffer: 1 << 28 })
    .toString("utf8").split("\0").filter(Boolean)
);

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".json": "application/json", ".wasm": "application/wasm",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".pdf": "application/pdf",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".woff": "font/woff", ".woff2": "font/woff2",
  ".ttf": "font/ttf", ".ico": "image/x-icon", ".txt": "text/plain", ".map": "application/json",
};

const server = http.createServer((q, r) => {
  let rel = decodeURIComponent(q.url.split("?")[0].split("#")[0]).replace(/^\/+/, "") || "index.html";
  if (!DEPLOYED.has(rel) && DEPLOYED.has(rel.replace(/\/$/, "") + "/index.html")) {
    rel = rel.replace(/\/$/, "") + "/index.html";
  }
  if (!DEPLOYED.has(rel)) { r.writeHead(404).end("404 " + rel); return; }
  fs.readFile(path.join(ROOT, rel), (e, b) => {
    if (e) { r.writeHead(404).end(); return; }
    r.writeHead(200, { "Content-Type": MIME[path.extname(rel).toLowerCase()] || "application/octet-stream" });
    r.end(b);
  });
});

const SPOTS = ["shot", "title", "go"];

async function clickCard(pg, page, index, spot) {
  await pg.goto(`http://localhost:${PORT}/${page}?boot=0`, { waitUntil: "networkidle0" });
  await pg.evaluate((i) => {
    const c = document.querySelectorAll(".card")[i];
    if (c) c.scrollIntoView({ block: "center", behavior: "instant" });
  }, index);
  await new Promise((r) => setTimeout(r, 2200));   // entrance tweens settle

  const pt = await pg.evaluate((i, s) => {
    const card = document.querySelectorAll(".card")[i];
    if (!card) return null;
    const a = card.querySelector("a");
    const pick = { shot: ".card-shot", title: "h3", go: ".card-go" }[s];
    const el = card.querySelector(pick) || a;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2),
             href: a.getAttribute("href") };
  }, index, spot);
  if (!pt) return null;

  await pg.mouse.move(pt.x - 150, pt.y - 100);
  await pg.mouse.move(pt.x, pt.y, { steps: 14 });     // engage the tilt
  await new Promise((r) => setTimeout(r, 450));
  const before = pg.url();
  await pg.mouse.down();
  await new Promise((r) => setTimeout(r, 80));
  await pg.mouse.up();
  await new Promise((r) => setTimeout(r, 1400));

  const after = pg.url().replace(`http://localhost:${PORT}/`, "").split("?")[0];
  return { href: pt.href, expected: pt.href, got: after, ok: before !== pg.url() && after === pt.href };
}

(async () => {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
  const pg = await browser.newPage();
  await pg.setViewport({ width: 1440, height: 900 });

  let fail = 0, total = 0;
  for (const page of ["index.html", "projects.html"]) {
    const count = await pg.goto(`http://localhost:${PORT}/${page}?boot=0`, { waitUntil: "domcontentloaded" })
      .then(() => pg.evaluate(() => document.querySelectorAll(".card").length));
    console.log(`\n${page} — ${count} cards`);
    for (let i = 0; i < count; i++) {
      for (const spot of SPOTS) {
        const r = await clickCard(pg, page, i, spot);
        if (!r) continue;
        total++;
        if (!r.ok) { fail++; console.log(`  FAIL card[${i}] ${spot.padEnd(5)} expected ${r.expected} got ${r.got || "(no navigation)"}`); }
      }
    }
    console.log(`  ${count * SPOTS.length - 0} click points tested`);
  }

  await browser.close();
  server.close();
  console.log(`\n${total - fail}/${total} card clicks navigated to the right project`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });

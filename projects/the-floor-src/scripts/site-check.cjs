// Checks a downloaded ZIP the two ways a beginner will use it: opened from
// disk by double-clicking index.html, and dropped onto a static host.
//
//   const { checkSite } = require("./site-check.cjs");
//   const report = await checkSite({ zip: "downloads/x.zip", outDir: "qa-shots/x/final" });
//
// CLI: node scripts/site-check.cjs <zip> <outDir>
// Writes <outDir>/site (unzipped), disk-*.png screenshots and report.json.
const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");
const puppeteer = require("C:/Users/ilove/Documents/GitHub/MKSite/projects/blackjack with yugi/node_modules/puppeteer");
const JSZip = require("jszip");

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
  ".txt": "text/plain",
};

function serve(dir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split("?")[0]);
      let file = path.join(dir, urlPath);
      if (urlPath.endsWith("/")) file = path.join(file, "index.html");
      if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404);
        return res.end("not found");
      }
      res.writeHead(200, { "content-type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}
function get(url) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        let n = 0;
        res.on("data", (c) => (n += c.length));
        res.on("end", () => resolve({ status: res.statusCode, bytes: n }));
      })
      .on("error", () => resolve({ status: 0, bytes: 0 }));
  });
}

async function checkSite({ zip, outDir, screenshots = true }) {
  const out = path.resolve(outDir);
  const unz = path.join(out, "site");
  fs.rmSync(unz, { recursive: true, force: true });
  fs.mkdirSync(unz, { recursive: true });
  const report = { zip: path.basename(zip), bytes: fs.statSync(zip).size, files: [], checks: [], problems: [] };
  const check = (ok, label, detail) => {
    report.checks.push({ ok, label, detail });
    if (!ok) report.problems.push(`${label}${detail ? ": " + detail : ""}`);
  };

  const z = await JSZip.loadAsync(fs.readFileSync(zip));
  for (const [name, entry] of Object.entries(z.files)) {
    if (entry.dir) continue;
    const full = path.join(unz, name);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, await entry.async("nodebuffer"));
    report.files.push(name);
  }
  report.files.sort();
  check(fs.existsSync(path.join(unz, "index.html")), "index.html at the top level of the ZIP");
  check(fs.existsSync(path.join(unz, "README.txt")), "README.txt present");
  if (fs.existsSync(path.join(unz, "README.txt"))) {
    const readme = fs.readFileSync(path.join(unz, "README.txt"), "utf8");
    report.readmeWarning = /BEFORE YOU PUT IT ONLINE/.test(readme) ? readme.split("BEFORE YOU PUT IT ONLINE")[1].split("\n\n")[0].trim() : null;
  }

  const pages = fs.readdirSync(unz).filter((f) => f.endsWith(".html")).sort();
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const failed = [];
  page.on("requestfailed", (r) => failed.push(r.url()));
  for (const file of pages) {
    const url = "file:///" + path.join(unz, file).replace(/\\/g, "/");
    for (const [label, vp] of [
      ["desktop", { width: 1280, height: 800 }],
      ["phone", { width: 375, height: 800 }],
    ]) {
      await page.setViewport(vp);
      await page.goto(url, { waitUntil: "networkidle0" });
      await page.evaluate(() => document.fonts.ready);
      const r = await page.evaluate(() => {
        const imgs = [...document.images];
        const broken = imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute("src"));
        const styled = getComputedStyle(document.querySelector(".site-header")).position === "sticky";
        const links = [...document.querySelectorAll('a[href$=".html"]')].map((a) => a.getAttribute("href"));
        const wide = document.documentElement.scrollWidth > window.innerWidth + 1;
        return { imgs: imgs.length, broken, styled, links, wide };
      });
      check(r.styled, `${file} (${label}) stylesheet applies from disk`);
      check(r.broken.length === 0, `${file} (${label}) all ${r.imgs} images load from disk`, r.broken.join(","));
      check(!r.wide, `${file} (${label}) no horizontal scrolling`);
      const missing = r.links.filter((l) => !fs.existsSync(path.join(unz, l)));
      check(missing.length === 0, `${file} (${label}) nav links point at real files`, missing.join(","));
      if (label === "phone") {
        await page.click(".menu-toggle summary");
        const navShown = await page.evaluate(() => getComputedStyle(document.querySelector(".site-nav")).display !== "none");
        check(navShown, `${file} (phone) menu opens without JavaScript`);
      }
      if (screenshots) await page.screenshot({ path: path.join(out, `disk-${file.replace(".html", "")}-${label}.png`), fullPage: true });
    }
  }
  const css = fs.existsSync(path.join(unz, "styles.css")) ? fs.readFileSync(path.join(unz, "styles.css"), "utf8") : "";
  const fontRefs = [...css.matchAll(/url\("([^"]+\.woff2)"\)/g)].map((m) => m[1]);
  check(fontRefs.every((f) => fs.existsSync(path.join(unz, f))), `bundled fonts present (${fontRefs.length})`);
  if (fontRefs.length && pages.length) {
    await page.goto("file:///" + path.join(unz, "index.html").replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const fam = (css.match(/font-family:\s*"([^"]+)";\s*font-style/) || [])[1];
    const loaded = fam ? await page.evaluate((f) => [...document.fonts].some((face) => face.family.replace(/"/g, "") === f && face.status === "loaded"), fam) : false;
    check(loaded, `bundled font "${fam}" renders from disk`);
  }
  check(failed.length === 0, "no failed requests from disk", failed.slice(0, 3).join(","));
  await browser.close();

  // Static host: every linked file must be served.
  const { server, port } = await serve(unz);
  const root = `http://127.0.0.1:${port}/`;
  const seen = new Set();
  const queue = ["index.html"];
  const bad = [];
  while (queue.length) {
    const rel = queue.shift();
    if (seen.has(rel)) continue;
    seen.add(rel);
    const r = await get(root + rel);
    if (r.status !== 200 || r.bytes === 0) bad.push(`${rel} -> ${r.status}`);
    const full = path.join(unz, rel);
    if (rel.endsWith(".html") && fs.existsSync(full)) {
      for (const m of fs.readFileSync(full, "utf8").matchAll(/(?:src|href)="([^"]+)"/g)) {
        if (/^(https?:|mailto:|tel:|#|data:)/.test(m[1])) continue;
        queue.push(m[1].split("#")[0]);
      }
    }
    if (rel.endsWith(".css") && fs.existsSync(full)) {
      for (const m of fs.readFileSync(full, "utf8").matchAll(/url\("([^"]+)"\)/g)) queue.push(m[1]);
    }
  }
  server.close();
  check(bad.length === 0, `static host serves every linked file (${seen.size} requests)`, bad.join(", "));
  report.hosted = { requests: seen.size };
  report.passed = report.checks.filter((c) => c.ok).length;
  report.total = report.checks.length;
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
  return report;
}

module.exports = { checkSite };

if (require.main === module) {
  const [zip, outDir] = process.argv.slice(2);
  if (!zip || !outDir) {
    console.error("usage: node scripts/site-check.cjs <zip> <outDir>");
    process.exit(2);
  }
  checkSite({ zip, outDir })
    .then((r) => {
      console.log(`${r.passed}/${r.total} checks passed, ZIP ${Math.round(r.bytes / 1024)} KB, ${r.files.length} files`);
      if (r.problems.length) {
        console.log("PROBLEMS:\n" + r.problems.join("\n"));
        process.exit(1);
      }
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

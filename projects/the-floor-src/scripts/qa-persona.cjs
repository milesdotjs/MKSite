// Plays a beginner building a site with The Floor, end to end, then checks the
// result the two ways a beginner will use it: double-clicking index.html, and
// dropping the folder onto a static host.
//
//   node scripts/qa-persona.cjs <baseUrl> <persona.json> <outDir>
//
// persona.json:
// {
//   "name": "Blue Door Café", "tagline": "Good coffee, no fuss", "type": "Restaurant",
//   "layout": "Big image banner", "palette": "Teal", "font": "Elegant",
//   "logo": "C:/path/logo.png" | null,
//   "pages": ["About", "Services", "Gallery", "Contact"],   // which optional pages to have on
//   "hero": "C:/path/hero.jpg" | null,
//   "gallery": ["C:/path/a.jpg", ...],
//   "headline": "optional replacement headline",
//   "story": "optional replacement About story",
//   "viewport": { "width": 1280, "height": 800 }            // or a phone size
// }
//
// Writes screenshots, the ZIP, the unzipped site, and report.json into outDir.
// Exit code 1 if any check fails.
const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");
const puppeteer = require("C:/Users/ilove/Documents/GitHub/MKSite/projects/blackjack with yugi/node_modules/puppeteer");
const JSZip = require("jszip");

const [baseArg, personaFile, outArg] = process.argv.slice(2);
if (!baseArg || !personaFile || !outArg) {
  console.error("usage: node scripts/qa-persona.cjs <baseUrl> <persona.json> <outDir>");
  process.exit(2);
}
const base = baseArg.replace(/\/+$/, "") + "/";
const persona = JSON.parse(fs.readFileSync(personaFile, "utf8"));
// Image paths in the persona file may be relative to the file itself.
const personaDir = path.dirname(path.resolve(personaFile));
const abs = (p) => (p && !path.isAbsolute(p) ? path.resolve(personaDir, p) : p);
persona.logo = abs(persona.logo);
persona.hero = abs(persona.hero);
persona.gallery = (persona.gallery || []).map(abs);
const out = path.resolve(outArg);
const dl = path.join(out, "downloads");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(dl, { recursive: true });

const report = { persona: persona.name, steps: [], checks: [], timings: {}, zip: null };
const problems = [];
const t0 = Date.now();
const mark = (label) => (report.timings[label] = Date.now() - t0);
const check = (ok, label, detail) => {
  report.checks.push({ ok, label, detail });
  if (!ok) problems.push(`${label}${detail ? ": " + detail : ""}`);
  console.log((ok ? "ok   " : "FAIL ") + label + (detail && !ok ? "  " + detail : ""));
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name, full = true) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: full });
}

async function clickChoice(page, title) {
  const handles = await page.$$(".choice");
  for (const h of handles) {
    const t = (await h.evaluate((el) => (el.querySelector(".choice-title") || el).textContent || "")).trim();
    if (t === title || t.startsWith(title)) {
      await h.evaluate((el) => el.scrollIntoView({ block: "center" }));
      await h.click();
      return;
    }
  }
  throw new Error(`No choice titled "${title}"`);
}

async function clickNavButton(page, textStart) {
  const handles = await page.$$(".wizard-nav button");
  for (const h of handles) {
    const t = (await h.evaluate((el) => el.textContent || "")).trim();
    if (t.startsWith(textStart)) {
      await h.click();
      return;
    }
  }
  throw new Error(`No wizard button starting "${textStart}"`);
}

async function next(page) {
  for (const label of ["Next", "Looks fine", "Download the ZIP"]) {
    try {
      await clickNavButton(page, label);
      await sleep(250);
      return;
    } catch {
      /* try the next label */
    }
  }
  throw new Error("No way forward");
}

async function setInput(page, selector, value) {
  await page.$eval(selector, (el) => {
    el.focus();
    el.select();
  });
  await page.keyboard.press("Backspace");
  if (value) await page.type(selector, value);
}

/* ---------- static host used for the "drop the folder on a host" check ---------- */
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
        res.on("end", () => resolve({ status: res.statusCode, bytes: n, type: res.headers["content-type"] }));
      })
      .on("error", () => resolve({ status: 0, bytes: 0 }));
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !/googletagmanager|google-analytics/.test(m.text())) errors.push(`console: ${m.text()}`);
  });
  const cdp = await page.createCDPSession();
  await cdp.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: dl });
  await page.setViewport(persona.viewport || { width: 1280, height: 800 });

  /* ---------- the wizard ---------- */
  await page.goto(base + "build/", { waitUntil: "networkidle0" });
  await page.waitForSelector("#business-name");
  mark("wizard_loaded");

  await page.type("#business-name", persona.name);
  if (persona.tagline !== undefined) await setInput(page, "#tagline", persona.tagline);
  await clickChoice(page, persona.type);
  const chosenType = await page.$$eval(".choice[aria-pressed='true'] .choice-title", (els) => els.map((e) => e.textContent.trim()));
  check(chosenType.some((t) => t.startsWith(persona.type)), "business type selected as intended", chosenType.join(","));
  await shot(page, "01-basics");
  await next(page);

  await page.waitForSelector(".choice-thumb");
  await clickChoice(page, persona.layout);
  await next(page);

  await page.waitForSelector(".swatches");
  await clickChoice(page, persona.palette);
  await next(page);

  await page.waitForSelector(".font-sample");
  await clickChoice(page, persona.font);
  await next(page);

  await page.waitForSelector("#logo-upload");
  if (persona.logo) {
    const input = await page.$("#logo-upload");
    await input.uploadFile(persona.logo);
    await page.waitForSelector(".upload-preview img");
  }
  await shot(page, "05-logo", false);
  await next(page);

  await page.waitForSelector(".check");
  const wanted = new Set(persona.pages || ["About", "Services", "Contact"]);
  for (const label of ["About", "Services", "Gallery", "Contact"]) {
    const checks = await page.$$(".check");
    for (const c of checks) {
      const name = (await c.$eval("strong", (el) => el.textContent)).trim();
      if (name !== label) continue;
      const on = await c.$eval("input", (el) => el.checked);
      if (on !== wanted.has(label)) {
        await c.evaluate((el) => el.scrollIntoView({ block: "center" }));
        await c.click();
      }
    }
  }
  await next(page);

  await page.waitForSelector("#headline");
  if (persona.headline) await setInput(page, "#headline", persona.headline);
  if (persona.hero) {
    const input = await page.$("#hero-upload");
    await input.uploadFile(persona.hero);
    await page.waitForSelector(".upload-preview img");
  }
  if (persona.story && (await page.$("#story"))) await setInput(page, "#story", persona.story);
  if (persona.gallery && persona.gallery.length && (await page.$("#gallery-upload"))) {
    const input = await page.$("#gallery-upload");
    await input.uploadFile(...persona.gallery);
    await page.waitForFunction((n) => document.querySelectorAll(".thumb img").length >= n, {}, persona.gallery.length);
  }
  await shot(page, "07-content");
  mark("content_done");
  await next(page);

  await page.waitForSelector(".preview-frame");
  await sleep(1200);
  await shot(page, "08-preview", false);
  const frame = page.frames().find((f) => f.parentFrame() && f.url().startsWith("about:srcdoc"));
  check(!!frame, "preview iframe rendered");
  if (frame) {
    const heroImgOk = await frame.evaluate(() => {
      const img = document.querySelector(".hero-bg, .hero-img");
      return img ? img.complete && img.naturalWidth > 0 : "no-image";
    });
    check(!persona.hero || heroImgOk === true, "hero photo shows in preview", String(heroImgOk));
  }
  await next(page);

  await page.waitForSelector(".got-list");
  await shot(page, "09-reality");
  await next(page);

  await page.waitForSelector(".download-box");
  const tDl = Date.now();
  const btns = await page.$$(".download-box button");
  await btns[0].click();
  let zipFile = null;
  for (let i = 0; i < 120 && !zipFile; i++) {
    await sleep(250);
    zipFile = fs.readdirSync(dl).find((f) => f.endsWith(".zip"));
  }
  check(!!zipFile, "ZIP downloaded");
  report.timings.zip_build_ms = Date.now() - tDl;
  mark("zip_downloaded");
  await shot(page, "10-download", false);
  check(errors.length === 0, "no page errors during wizard", errors.join(" | "));

  /* ---------- unzip ---------- */
  const unz = path.join(out, "site");
  if (zipFile) {
    const buf = fs.readFileSync(path.join(dl, zipFile));
    report.zip = { file: zipFile, bytes: buf.length };
    const zip = await JSZip.loadAsync(buf);
    for (const [name, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const full = path.join(unz, name);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, await entry.async("nodebuffer"));
    }
    report.zip.files = Object.keys(zip.files).filter((n) => !zip.files[n].dir).sort();
    check(fs.existsSync(path.join(unz, "index.html")), "ZIP has index.html at the top level");
    check(fs.existsSync(path.join(unz, "README.txt")), "ZIP has README.txt");
    const readme = fs.readFileSync(path.join(unz, "README.txt"), "utf8");
    report.readme = readme;
  }

  /* ---------- open from disk, like a double-click ---------- */
  const pages = fs.existsSync(unz) ? fs.readdirSync(unz).filter((f) => f.endsWith(".html")) : [];
  const disk = await browser.newPage();
  const diskErrors = [];
  disk.on("requestfailed", (r) => diskErrors.push(r.url()));
  for (const file of pages) {
    const url = "file:///" + path.join(unz, file).replace(/\\/g, "/");
    for (const [label, vp] of [
      ["desktop", { width: 1280, height: 800 }],
      ["phone", { width: 375, height: 800 }],
    ]) {
      await disk.setViewport(vp);
      await disk.goto(url, { waitUntil: "networkidle0" });
      const r = await disk.evaluate(() => {
        const imgs = [...document.images];
        const broken = imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute("src"));
        const styled = getComputedStyle(document.querySelector(".site-header")).position === "sticky";
        const links = [...document.querySelectorAll('a[href$=".html"]')].map((a) => a.getAttribute("href"));
        return { imgs: imgs.length, broken, styled, links, title: document.title };
      });
      check(r.styled, `${file} (${label}) stylesheet applied from disk`);
      check(r.broken.length === 0, `${file} (${label}) all ${r.imgs} images load from disk`, r.broken.join(","));
      const missing = r.links.filter((l) => !fs.existsSync(path.join(unz, l)));
      check(missing.length === 0, `${file} (${label}) nav links point at real files`, missing.join(","));
      if (label === "phone") {
        await disk.click(".menu-toggle summary");
        const navShown = await disk.evaluate(() => getComputedStyle(document.querySelector(".site-nav")).display !== "none");
        check(navShown, `${file} (phone) menu opens without JavaScript`);
      }
      await disk.screenshot({ path: path.join(out, `disk-${file.replace(".html", "")}-${label}.png`), fullPage: true });
    }
  }
  // Fonts, if the style bundles any: the CSS must reference assets/fonts and the files must exist.
  const css = fs.existsSync(path.join(unz, "styles.css")) ? fs.readFileSync(path.join(unz, "styles.css"), "utf8") : "";
  const fontRefs = [...css.matchAll(/url\("([^"]+\.woff2)"\)/g)].map((m) => m[1]);
  const fontMissing = fontRefs.filter((f) => !fs.existsSync(path.join(unz, f)));
  check(fontMissing.length === 0, `bundled fonts present (${fontRefs.length})`, fontMissing.join(","));
  if (fontRefs.length && pages.length) {
    await disk.goto("file:///" + path.join(unz, "index.html").replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    const fam = (css.match(/font-family:\s*"([^"]+)";\s*font-style/) || [])[1];
    await disk.evaluate(() => document.fonts.ready);
    const loaded = fam ? await disk.evaluate((f) => [...document.fonts].some((face) => face.family.replace(/"/g, "") === f && face.status === "loaded"), fam) : false;
    check(loaded, `bundled font "${fam}" actually renders from disk`);
  }
  check(diskErrors.length === 0, "no failed requests when opened from disk", diskErrors.slice(0, 3).join(","));
  mark("disk_checked");

  /* ---------- drop the folder on a static host ---------- */
  if (fs.existsSync(unz)) {
    const { server, port } = await serve(unz);
    const root = `http://127.0.0.1:${port}/`;
    const seen = new Set();
    const queue = ["index.html"];
    let bad = [];
    while (queue.length) {
      const rel = queue.shift();
      if (seen.has(rel)) continue;
      seen.add(rel);
      const r = await get(root + rel);
      if (r.status !== 200 || r.bytes === 0) bad.push(`${rel} -> ${r.status}`);
      if (rel.endsWith(".html") && r.status === 200) {
        const html = fs.readFileSync(path.join(unz, rel), "utf8");
        for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
          const ref = m[1];
          if (/^(https?:|mailto:|tel:|#|data:)/.test(ref)) continue;
          queue.push(ref.split("#")[0]);
        }
      }
      if (rel.endsWith(".css")) {
        const text = fs.readFileSync(path.join(unz, rel), "utf8");
        for (const m of text.matchAll(/url\("([^"]+)"\)/g)) queue.push(m[1]);
      }
    }
    check(bad.length === 0, `static host serves every linked file (${seen.size} requests)`, bad.join(", "));
    // The site is served from a subfolder too, the way GitHub Pages does it.
    const sub = await get(root + "index.html");
    check(sub.status === 200, "index served");
    server.close();
    report.hosted = { requests: seen.size, bad };
  }
  mark("host_checked");

  await browser.close();
  report.problems = problems;
  fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));
  console.log(`\n${persona.name}: ${report.checks.filter((c) => c.ok).length}/${report.checks.length} checks passed, ZIP ${report.zip ? Math.round(report.zip.bytes / 1024) + " KB" : "none"}, total ${Math.round((Date.now() - t0) / 1000)}s`);
  if (problems.length) {
    console.log("PROBLEMS:\n" + problems.join("\n"));
    process.exit(1);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

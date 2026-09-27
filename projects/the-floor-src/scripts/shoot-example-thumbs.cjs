// Screenshots each published example site for the gallery cards.
// Usage: node scripts/shoot-example-thumbs.cjs
const path = require("node:path");
const fs = require("node:fs");
const puppeteer = require("C:/Users/ilove/Documents/GitHub/MKSite/projects/blackjack with yugi/node_modules/puppeteer");

const SITES = path.resolve("public/examples");
const OUT = path.resolve("public/examples-thumbs");

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  for (const slug of fs.readdirSync(SITES).sort()) {
    const file = path.join(SITES, slug, "index.html");
    if (!fs.existsSync(file)) continue;
    // Wide card: the hero plus the start of what follows.
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });
    await page.goto("file:///" + file.replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, `${slug}.jpg`), type: "jpeg", quality: 78 });

    // Tall shot showing both pictures, for the detail view.
    const h = await page.evaluate(() => {
      const band = document.querySelector("section.band");
      return band ? Math.min(document.documentElement.scrollHeight, band.offsetTop + band.offsetHeight) : 1600;
    });
    await page.setViewport({ width: 1200, height: Math.min(h, 3000), deviceScaleFactor: 1 });
    await page.goto("file:///" + file.replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, `${slug}-full.jpg`), type: "jpeg", quality: 72 });

    // Phone shot.
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.goto("file:///" + file.replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(OUT, `${slug}-phone.jpg`), type: "jpeg", quality: 78 });
    console.log(slug, "->", ["", "-full", "-phone"].map((s) => `${Math.round(fs.statSync(path.join(OUT, slug + s + ".jpg")).size / 1024)}KB`).join(" "));
  }
  await browser.close();
  const total = fs.readdirSync(OUT).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
  console.log(`thumbnails: ${(total / 1024 / 1024).toFixed(1)} MB`);
})().catch((e) => { console.error(e); process.exit(1); });

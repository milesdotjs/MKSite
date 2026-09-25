// Drives the built app end to end: landing, every wizard step, the preview
// iframe, the ZIP download, and the IndexedDB restore after a reload.
// Usage: node drive-wizard.cjs <baseUrl> <outDir>
const path = require("node:path");
const fs = require("node:fs");
const puppeteer = require("C:/Users/ilove/Documents/GitHub/MKSite/Projects/blackjack with yugi/node_modules/puppeteer");
const JSZip = require("jszip");

const base = process.argv[2].replace(/\/+$/, "") + "/";
const out = path.resolve(process.argv[3]);
const dl = path.join(out, "downloads");
fs.mkdirSync(dl, { recursive: true });

const errors = [];

async function shot(page, name, full = true) {
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: full });
  console.log("shot", name);
}

async function clickText(page, selector, text) {
  const handles = await page.$$(selector);
  for (const h of handles) {
    const t = (await h.evaluate((el) => (el.querySelector(".choice-title") || el).textContent || "")).trim();
    if (t === text || t.startsWith(text)) {
      await h.click();
      return true;
    }
  }
  throw new Error(`No ${selector} with text "${text}"`);
}

async function next(page) {
  await clickText(page, ".wizard-nav button", "Next").catch(async () => {
    await clickText(page, ".wizard-nav button", "Looks fine").catch(() => clickText(page, ".wizard-nav button", "Download the ZIP"));
  });
  await new Promise((r) => setTimeout(r, 150));
}

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("requestfailed", (r) => errors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));
  const origin = new URL(base).origin;
  const offOrigin = new Set();
  page.on("request", (r) => { const u = r.url(); if (!u.startsWith(origin) && !u.startsWith("file:") && !u.startsWith("about:") && !u.startsWith("data:") && !u.startsWith("blob:")) offOrigin.add(u); });
  const cdp = await page.createCDPSession();
  await cdp.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: dl });

  // Landing
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(base, { waitUntil: "networkidle0" });
  await shot(page, "00-landing-desktop");
  await page.setViewport({ width: 375, height: 800 });
  await shot(page, "00-landing-phone");
  await page.setViewport({ width: 1280, height: 800 });

  for (const p of ["glossary/", "red-flags/", "for-developers/"]) {
    await page.goto(base + p, { waitUntil: "networkidle0" });
    await shot(page, `01-${p.replace("/", "")}`);
  }

  // Wizard
  await page.goto(base + "build/", { waitUntil: "networkidle0" });
  await page.waitForSelector("#business-name");
  await shot(page, "10-basics-empty", false);
  await page.type("#business-name", "Blue Door Café");
  await clickText(page, ".choice", "Restaurant");
  await shot(page, "10-basics-filled");
  await next(page);

  await page.waitForSelector(".choice-thumb");
  await shot(page, "11-layout");
  await clickText(page, ".choice", "Big image banner");
  await next(page);

  await page.waitForSelector(".swatches");
  await shot(page, "12-palette");
  await clickText(page, ".choice", "Teal");
  await next(page);

  await page.waitForSelector(".font-sample");
  await new Promise((r) => setTimeout(r, 600));
  await shot(page, "13-fonts");
  await clickText(page, ".choice", "Elegant");
  await next(page);

  await page.waitForSelector("#logo-upload");
  await shot(page, "14-logo");
  await next(page);

  await page.waitForSelector(".check");
  // Turn on gallery.
  const gallery = (await page.$$(".check"))[3];
  await gallery.click();
  await shot(page, "15-pages");
  await next(page);

  await page.waitForSelector("#headline");
  await shot(page, "16-content");
  // Open an explainer popover and screenshot it.
  const trigger = (await page.$$(".explainer-trigger"))[0];
  await trigger.click();
  await page.waitForSelector(".explainer-panel");
  await shot(page, "16-content-explainer", false);
  await page.keyboard.press("Escape");
  const stillOpen = await page.$(".explainer-panel");
  if (stillOpen) errors.push("Explainer did not close on Escape");
  // Upload a hero photo and two gallery photos.
  const svg = (hue) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080"><rect width="1920" height="1080" fill="hsl(${hue},50%,45%)"/><circle cx="1300" cy="380" r="240" fill="rgba(255,255,255,.2)"/></svg>`;
  const tmpHero = path.join(out, "hero.svg");
  fs.writeFileSync(tmpHero, svg(180));
  const tmpG1 = path.join(out, "g1.svg");
  fs.writeFileSync(tmpG1, svg(30));
  const tmpG2 = path.join(out, "g2.svg");
  fs.writeFileSync(tmpG2, svg(300));
  const heroInput = await page.$("#hero-upload");
  await heroInput.uploadFile(tmpHero);
  await page.waitForSelector(".upload-preview img");
  const galleryInput = await page.$("#gallery-upload");
  await galleryInput.uploadFile(tmpG1, tmpG2);
  await page.waitForSelector(".thumb img");
  // Change the headline to prove custom text is tracked.
  await page.$eval("#headline", (el) => { el.focus(); el.select(); });
  await page.keyboard.press("Backspace");
  await page.type("#headline", "Coffee worth crossing town for");
  const headlineNow = await page.$eval("#headline", (el) => el.value);
  if (headlineNow !== "Coffee worth crossing town for") errors.push(`Headline edit produced "${headlineNow}"`);
  await shot(page, "16-content-with-uploads");
  await next(page);

  await page.waitForSelector(".preview-frame");
  await new Promise((r) => setTimeout(r, 800));
  await shot(page, "17-preview-desktop", false);
  // Click the About link inside the iframe.
  const frame = page.frames().find((f) => f.parentFrame() && f.url().startsWith("about:srcdoc"));
  if (!frame) errors.push("No srcdoc frame found");
  else {
    const link = await frame.$('.site-nav a[href="about.html"]');
    await link.click();
    await new Promise((r) => setTimeout(r, 500));
    const pressed = await page.$$eval(".preview-bar .seg:first-child button", (bs) => bs.map((b) => [b.textContent, b.getAttribute("aria-pressed")]));
    const aboutOn = pressed.find(([t]) => t === "About")?.[1] === "true";
    if (!aboutOn) errors.push("Clicking About in the preview did not switch the page");
  }
  await clickText(page, ".seg button", "Phone");
  await new Promise((r) => setTimeout(r, 600));
  await shot(page, "17-preview-phone-about", false);
  await next(page);

  await page.waitForSelector(".got-list");
  const first = await page.$(".card summary");
  await first.click();
  await shot(page, "18-reality");
  await next(page);

  await page.waitForSelector(".download-box");
  await shot(page, "19-download");
  await clickText(page, ".download-box button", "Download the ZIP");
  // Wait for the file.
  let zipFile = null;
  for (let i = 0; i < 40 && !zipFile; i++) {
    await new Promise((r) => setTimeout(r, 250));
    zipFile = fs.readdirSync(dl).find((f) => f.endsWith(".zip"));
  }
  if (!zipFile) errors.push("No ZIP was downloaded");
  else {
    const zip = await JSZip.loadAsync(fs.readFileSync(path.join(dl, zipFile)));
    const names = Object.keys(zip.files).sort();
    console.log("ZIP", zipFile, fs.statSync(path.join(dl, zipFile)).size, "bytes");
    console.log(names.join("\n"));
    const index = await zip.file("index.html").async("string");
    if (!index.includes("<h1>Coffee worth crossing town for</h1>")) errors.push("ZIP index.html missing the custom headline as the h1");
    if (!index.includes('href="styles.css"')) errors.push("ZIP index.html doesn't link styles.css");
    if (!names.some((n) => n.startsWith("assets/hero-"))) errors.push("ZIP missing hero image");
    if (!names.some((n) => n.startsWith("assets/fonts/playfair"))) errors.push("ZIP missing Playfair fonts");
    // Unzip for a screenshot of the downloaded site opened from disk.
    const unz = path.join(out, "unzipped");
    fs.rmSync(unz, { recursive: true, force: true });
    for (const [name, entry] of Object.entries(zip.files)) {
      if (entry.dir) continue;
      const full = path.join(unz, name);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, await entry.async("nodebuffer"));
    }
    await page.goto("file:///" + path.join(unz, "index.html").replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    await shot(page, "20-downloaded-site-from-disk");
    await page.goto("file:///" + path.join(unz, "gallery.html").replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    await shot(page, "20-downloaded-gallery-from-disk");
  }
  await shot(page, "19-download-done", false);

  // Reload: restore from IndexedDB.
  await page.goto(base + "build/", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 500));
  const restoredStep = await page.$eval(".wizard-progress .wrap span", (el) => el.textContent);
  console.log("After reload:", restoredStep);
  if (!/Step 10/.test(restoredStep || "")) errors.push(`Restore landed on "${restoredStep}" instead of step 10`);
  await shot(page, "21-restored", false);
  const noticeVisible = await page.evaluate(() => { const n = document.querySelector(".notice"); if (!n) return false; const r = n.getBoundingClientRect(); return r.top >= 0 && r.bottom <= window.innerHeight; });
  if (!noticeVisible) errors.push("Welcome-back notice is not visible in the viewport after restore");
  // Go back to basics to prove the name survived.
  for (let i = 0; i < 9; i++) await clickText(page, ".wizard-nav button", "Back");
  const name = await page.$eval("#business-name", (el) => el.value);
  if (name !== "Blue Door Café") errors.push(`Restored name was "${name}"`);
  const heroKept = await page.evaluate(() => !!document.querySelector(".upload-preview img"));
  // (hero preview lives on the content step; check there)
  await page.setViewport({ width: 375, height: 800 });
  await shot(page, "22-basics-phone");

  // Start over must wipe everything, including IndexedDB, and survive a reload.
  page.once("dialog", (d) => d.accept());
  await clickText(page, ".wizard-progress button", "Start over");
  await new Promise((r) => setTimeout(r, 400));
  const afterName = await page.$eval("#business-name", (el) => el.value);
  if (afterName !== "") errors.push(`Start over left the name as "${afterName}"`);
  await page.goto(base + "build/", { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  const afterReload = await page.$eval(".wizard-progress .wrap span", (el) => el.textContent);
  const nameAfterReload = await page.$eval("#business-name", (el) => el.value).catch(() => "(no field)");
  if (!/Step 1 /.test(afterReload || "") || nameAfterReload !== "") errors.push(`After start over + reload: "${afterReload}", name "${nameAfterReload}"`);
  await shot(page, "23-after-start-over", false);

  if (offOrigin.size) errors.push("Off-origin requests: " + [...offOrigin].join(", "));
  else console.log("No off-origin requests during the whole session.");

  await browser.close();
  console.log("\nERRORS:", errors.length ? "\n" + errors.join("\n") : "none");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

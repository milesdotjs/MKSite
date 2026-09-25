// Screenshots every generated sample site at desktop and phone widths.
// Usage: node shoot-samples.cjs <samplesDir> <outDir>
const path = require("node:path");
const fs = require("node:fs");
const puppeteer = require("C:/Users/ilove/Documents/GitHub/MKSite/Projects/blackjack with yugi/node_modules/puppeteer");

const samples = path.resolve(process.argv[2]);
const out = path.resolve(process.argv[3]);
fs.mkdirSync(out, { recursive: true });

const pages = ["index.html", "about.html", "services.html", "gallery.html", "contact.html"];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const dirs = fs.readdirSync(samples).filter((d) => fs.statSync(path.join(samples, d)).isDirectory());
  for (const dir of dirs) {
    for (const file of pages) {
      const full = path.join(samples, dir, file);
      if (!fs.existsSync(full)) continue;
      // Only the home page for every sample; all pages for the rich variants.
      if (file !== "index.html" && !dir.endsWith("-rich")) continue;
      const url = "file:///" + full.replace(/\\/g, "/");
      for (const [label, w] of [["desktop", 1280], ["tablet", 768], ["phone", 375]]) {
        if (label === "phone" && file !== "index.html" && file !== "contact.html") continue;
        if (label === "tablet" && file !== "index.html") continue;
        await page.setViewport({ width: w, height: 800, deviceScaleFactor: 1 });
        await page.goto(url, { waitUntil: "networkidle0" });
        await page.evaluate(() => document.fonts.ready);
        const name = `${dir}__${file.replace(".html", "")}__${label}.png`;
        await page.screenshot({ path: path.join(out, name), fullPage: true });
        console.log(name);
      }
    }
  }
  // One phone shot with the menu open.
  const first = dirs.find((d) => d.endsWith("-rich"));
  if (first) {
    await page.setViewport({ width: 375, height: 800 });
    await page.goto("file:///" + path.join(samples, first, "index.html").replace(/\\/g, "/"), { waitUntil: "networkidle0" });
    await page.click("summary");
    await page.screenshot({ path: path.join(out, `${first}__menu-open__phone.png`) });
    console.log(`${first}__menu-open__phone.png`);
  }
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

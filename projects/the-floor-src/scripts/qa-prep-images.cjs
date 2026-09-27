// Fetches royalty-free photos (Unsplash photos served by picsum.photos, seeded so
// runs are repeatable) in the shapes beginners actually upload, and renders two
// logos: a transparent PNG and a JPEG with a white box, the common mistake.
// Usage: node scripts/qa-prep-images.cjs scripts/personas/images
const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");
const puppeteer = require("C:/Users/ilove/Documents/GitHub/MKSite/projects/blackjack with yugi/node_modules/puppeteer");

const out = path.resolve(process.argv[2]);
fs.mkdirSync(out, { recursive: true });

const photos = [
  // [file, seed, w, h] — landscape hero, square-ish gallery, a portrait phone photo, and a big phone-camera sized one
  ["cafe-hero.jpg", "bluedoor-hero", 1920, 1080],
  ["cafe-g1.jpg", "bluedoor-g1", 1600, 1200],
  ["cafe-g2.jpg", "bluedoor-g2", 1600, 1200],
  ["cafe-g3.jpg", "bluedoor-g3", 1600, 1200],
  ["cafe-g4.jpg", "bluedoor-g4", 1200, 1600],
  ["cafe-g5.jpg", "bluedoor-g5", 1600, 1200],
  ["cafe-g6.jpg", "bluedoor-g6", 1600, 1200],
  ["trades-hero-big.jpg", "trades-hero", 4000, 3000],
  ["trades-g1.jpg", "trades-g1", 3000, 2250],
  ["trades-g2.jpg", "trades-g2", 3000, 2250],
  ["trades-g3.jpg", "trades-g3", 2250, 3000],
  ["salon-hero-portrait.jpg", "salon-hero", 1200, 1600],
  ["salon-g1.jpg", "salon-g1", 1600, 1200],
  ["salon-g2.jpg", "salon-g2", 1600, 1200],
  ["salon-g3.jpg", "salon-g3", 1600, 1200],
  ["salon-g4.jpg", "salon-g4", 1600, 1200],
  ["fitness-hero.jpg", "fitness-hero", 1920, 1080],
  ["fitness-g1.jpg", "fitness-g1", 1600, 1200],
  ["fitness-g2.jpg", "fitness-g2", 1600, 1200],
];

function fetchTo(url, file, redirects = 0) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "the-floor-qa" } }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 5) {
          res.resume();
          return resolve(fetchTo(new URL(res.headers.location, url).toString(), file, redirects + 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`${res.statusCode} for ${url}`));
        }
        const ws = fs.createWriteStream(file);
        res.pipe(ws);
        ws.on("finish", () => resolve());
        ws.on("error", reject);
      })
      .on("error", reject);
  });
}

async function logo(name, text, jpeg) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 640, height: 200, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:${jpeg ? "#fff" : "transparent"}">
  <div style="display:flex;align-items:center;gap:18px;height:200px;padding:0 24px;font-family:Georgia,serif">
    <div style="width:120px;height:120px;border-radius:50%;background:#1f3a5f;display:grid;place-items:center;color:#fff;font:bold 64px Georgia,serif">${text[0]}</div>
    <div style="font:bold 58px Georgia,serif;color:#1f3a5f;letter-spacing:.5px">${text}</div>
  </div></body></html>`);
  await page.screenshot({ path: path.join(out, name), omitBackground: !jpeg, type: jpeg ? "jpeg" : "png", quality: jpeg ? 88 : undefined });
  await browser.close();
}

(async () => {
  for (const [file, seed, w, h] of photos) {
    const dest = path.join(out, file);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 10_000) {
      console.log("have  ", file);
      continue;
    }
    const url = `https://picsum.photos/seed/${seed}/${w}/${h}.jpg`;
    try {
      await fetchTo(url, dest);
      console.log("got   ", file, Math.round(fs.statSync(dest).size / 1024) + " KB");
    } catch (e) {
      console.log("FAILED", file, e.message);
    }
  }
  await logo("cafe-logo.png", "Blue Door", false);
  await logo("trades-logo-whitebox.jpg", "Walker & Son", true);
  console.log("logos rendered");
  console.log(fs.readdirSync(out).map((f) => `${f} ${Math.round(fs.statSync(path.join(out, f)).size / 1024)}KB`).join("\n"));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

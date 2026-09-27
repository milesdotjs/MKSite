// Fetches a royalty-free photo for a keyword, the way a person would grab one
// from a free stock site, plus a simple text logo renderer.
//
//   const { fetchImage, renderLogo } = require("./qa-fetch-image.cjs");
//   await fetchImage({ keyword: "bakery bread", w: 1920, h: 1080, seed: 1, out: "hero.jpg" });
//   await renderLogo({ text: "Corner Bakery", color: "#7f5539", out: "logo.png" });
//
// Sources, in order: Wikimedia Commons (CC and public-domain photos, searched
// by keyword, no key needed; `seed` picks the nth good candidate) and Lorem
// Picsum (Unsplash photos, random subject) as a fallback. The result tells
// you which source it came from and the Commons file title if any.
//
// CLI: node scripts/qa-fetch-image.cjs "<keyword>" <w> <h> <seed> <out.jpg>
const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

function get(url, redirects = 0, timeoutMs = 25000) {
  return new Promise((resolve, reject) => {
    const req = https
      .get(url, { headers: { "User-Agent": "the-floor-qa/1.0 (mileskingdev.com)" } }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects < 6) {
          res.resume();
          return resolve(get(new URL(res.headers.location, url).toString(), redirects + 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`${res.statusCode} for ${url}`));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve({ body: Buffer.concat(chunks), type: res.headers["content-type"] || "" }));
        res.on("error", reject);
      })
      .on("error", reject);
    // Commons can stall while it renders a big thumbnail; never wait forever.
    req.setTimeout(timeoutMs, () => req.destroy(new Error(`timeout after ${timeoutMs}ms for ${url}`)));
  });
}

/**
 * Wikimedia Commons: search for a keyword, keep real JPEG photos that are big
 * enough and the right orientation, and return the `seed`-th candidate's
 * thumbnail URL rendered at `w` pixels wide. Photos there are CC or public
 * domain, the kind of thing a person finds with "free photos of X".
 */
/** Strips the HTML Commons puts in its Artist field. */
function plain(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function commonsCandidates(keyword, w, orientation, tries = 3) {
  const q = encodeURIComponent(`filetype:bitmap ${keyword}`);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${q}&gsrnamespace=6&gsrlimit=40&prop=imageinfo&iiprop=url%7Csize%7Cmime%7Cextmetadata&iiurlwidth=${w}`;
  // Commons rate-limits; back off rather than silently falling back to a
  // random photo, which is how off-topic pictures end up in the gallery.
  let body;
  for (let attempt = 1; ; attempt++) {
    try {
      ({ body } = await get(url));
      break;
    } catch (e) {
      if (attempt >= tries) throw e;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  const pages = Object.values(JSON.parse(body.toString("utf8")).query?.pages || {});
  return pages
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map((p) => ({ title: p.title || "", info: p.imageinfo && p.imageinfo[0] }))
    .filter(({ title, info }) => {
      if (!info || info.mime !== "image/jpeg" || !info.thumburl) return false;
      if (/logo|icon|map|diagram|screenshot|chart|poster|flag|sign/i.test(title)) return false;
      if (info.width < 1200 || info.height < 800) return false;
      if (orientation === "landscape" && info.width <= info.height) return false;
      if (orientation === "portrait" && info.height <= info.width) return false;
      return true;
    })
    .map(({ title, info }) => {
      const m = info.extmetadata || {};
      return {
        title,
        url: info.thumburl,
        width: info.thumbwidth,
        height: info.thumbheight,
        original: info.width,
        credit: {
          title: title.replace(/^File:/, ""),
          author: plain(m.Artist && m.Artist.value) || "Unknown",
          license: plain(m.LicenseShortName && m.LicenseShortName.value) || "See file page",
          licenseUrl: plain(m.LicenseUrl && m.LicenseUrl.value) || "",
          filePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`,
        },
      };
    })
    // Smaller originals render as thumbnails in a fraction of the time; keep search order otherwise.
    .sort((a, b) => Number(a.original > 5000) - Number(b.original > 5000));
}

async function fetchImage({ keyword, w = 1920, h = 1080, seed = 1, out, orientation = w >= h ? "landscape" : "portrait" }) {
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  const attempts = [];
  try {
    const cands = await commonsCandidates(keyword, w, orientation);
    if (cands.length) {
      const pick = cands[(Math.max(1, seed) - 1) % cands.length];
      attempts.push({ name: "commons", url: pick.url, title: pick.title, credit: pick.credit });
    }
  } catch (e) {
    attempts.push({ name: "commons", url: null, error: e.message });
  }
  attempts.push({ name: "picsum", url: `https://picsum.photos/seed/${encodeURIComponent(keyword.replace(/\s+/g, "-"))}-${seed}/${w}/${h}.jpg` });
  let lastErr = null;
  for (const a of attempts) {
    if (!a.url) {
      lastErr = new Error(a.error || "no candidates");
      continue;
    }
    try {
      const { body, type } = await get(a.url);
      if (!/image\/(jpeg|png|webp)/.test(type) || body.length < 10_000) throw new Error(`unexpected ${type} ${body.length}B`);
      fs.writeFileSync(out, body);
      return {
        source: a.name,
        title: a.title || null,
        credit: a.credit || { title: "Lorem Picsum (Unsplash)", author: "Unsplash contributors", license: "Unsplash License", licenseUrl: "https://unsplash.com/license", filePage: "https://picsum.photos" },
        bytes: body.length,
        out: path.resolve(out),
      };
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error(`Couldn't fetch an image for "${keyword}": ${lastErr && lastErr.message}`);
}

/** Renders a plain text logo. PNG with a transparent background, or JPEG (white box) if `jpeg`. */
async function renderLogo({ text, color = "#1f3a5f", out, jpeg = false, font = "Georgia, serif", initial }) {
  const puppeteer = require("C:/Users/ilove/Documents/GitHub/MKSite/projects/blackjack with yugi/node_modules/puppeteer");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 640, height: 200, deviceScaleFactor: 1 });
  const letter = (initial || text.trim()[0] || "?").toUpperCase();
  await page.setContent(`<!doctype html><html><body style="margin:0;background:${jpeg ? "#fff" : "transparent"}">
  <div style="display:flex;align-items:center;gap:18px;height:200px;padding:0 24px;font-family:${font}">
    <div style="width:120px;height:120px;border-radius:50%;background:${color};display:grid;place-items:center;color:#fff;font:bold 64px ${font}">${letter}</div>
    <div style="font:bold 52px ${font};color:${color};letter-spacing:.5px;white-space:nowrap">${text}</div>
  </div></body></html>`);
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  await page.screenshot({ path: out, omitBackground: !jpeg, type: jpeg ? "jpeg" : "png", quality: jpeg ? 88 : undefined });
  await browser.close();
  return path.resolve(out);
}

module.exports = { fetchImage, renderLogo };

if (require.main === module) {
  const [keyword, w, h, seed, out] = process.argv.slice(2);
  if (!keyword || !out) {
    console.error('usage: node scripts/qa-fetch-image.cjs "<keyword>" <w> <h> <seed> <out.jpg>');
    process.exit(2);
  }
  fetchImage({ keyword, w: Number(w) || 1920, h: Number(h) || 1080, seed: Number(seed) || 1, out })
    .then((r) => console.log(`${r.source}: ${Math.round(r.bytes / 1024)} KB -> ${r.out}`))
    .catch((e) => {
      console.error(e.message);
      process.exit(1);
    });
}

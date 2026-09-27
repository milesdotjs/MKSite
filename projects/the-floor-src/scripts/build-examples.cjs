// Builds the public "What people built" gallery.
//
//   node scripts/build-examples.cjs            # everything
//   node scripts/build-examples.cjs --photos   # only re-fetch the photos
//   node scripts/build-examples.cjs --publish  # only copy + write content files
//
// What it does:
//  1. Fetches each demo site's photos from Wikimedia Commons, recording the
//     file, author and licence for every one (they are CC, so publishing them
//     on mileskingdev.com means crediting them).
//  2. Rebuilds those sites through the live wizard, exactly as an owner would.
//  3. Copies the finished sites into public/examples/<slug>/ so Astro ships
//     them, and writes src/content/examples.ts for the gallery page.
//
// Three sites were built by their own agents and are copied as they are; two
// of them ship only a locally drawn logo, so only Spoke & Chain needs a credit.
const path = require("node:path");
const fs = require("node:fs");
const { FloorSession } = require("./floor-driver.cjs");
const { fetchImage } = require("./qa-fetch-image.cjs");
const { checkSite } = require("./site-check.cjs");
const { CONFIGS } = require("../qa-shots/stress/finish.cjs");

const BASE = process.env.FLOOR_BASE || "https://mileskingdev.com/projects/the-floor/";
const STRESS = path.resolve("qa-shots/stress");
const WORK = path.resolve("qa-shots/examples");
const PUBLIC = path.resolve("public/examples");
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

/** Photo searches per site. First entry is the hero; the rest fill the gallery. */
const PHOTOS = {
  "corner-bakery": [
    ["sourdough bread", 1], ["bakery counter", 1], ["croissant", 1], ["bread loaves", 2],
    ["artisan bread", 1], ["bread basket", 1], ["baker kneading dough", 1],
  ],
  "muddy-paws": [["dog grooming", 1], ["poodle grooming", 1], ["dog bath", 1], ["golden retriever", 2]],
  "greenline-landscaping": [
    ["paving patio", 1], ["garden landscaping", 1], ["garden design", 2], ["lawn garden", 1], ["hedge trimming", 1],
  ],
  "lena-marsh-photography": [
    ["wedding ceremony", 1], ["wedding couple", 1], ["bride bouquet", 1], ["wedding reception", 1],
    ["wedding rings", 1], ["bridal portrait", 1], ["wedding guests", 1], ["wedding cake", 1],
    ["engagement couple", 1], ["family portrait outdoor", 1],
  ],
  "black-iris-tattoo": [["tattoo studio", 1], ["tattoo artist working", 1], ["tattoo machine", 1], ["tattoo sleeve", 1], ["tattoo convention", 2], ["tattoo parlour", 1]],
  "riverside-players": [
    ["theatre stage", 1], ["amateur theatre", 1], ["community theatre", 1], ["stage curtain", 1],
    ["actors rehearsal", 1], ["theatre auditorium", 1], ["stage lighting", 1], ["theatre performance", 1], ["drama rehearsal", 1],
  ],
  "still-point-yoga": [["yoga class", 1], ["yoga studio", 2], ["yoga mat", 1], ["meditation", 1], ["yoga pose", 2], ["yoga practice", 1]],
};

/** Sites their own agents finished; copied as they are. */
const PREBUILT = {
  "spoke-and-chain": {
    title: "Spoke & Chain",
    trade: "Bike repair shop",
    blurb: "Built on a phone between customers, in the smallest number of taps the wizard allows.",
    credits: [{ title: "Munich - Two men working in a Bicycle repair shop - 5893.jpg" }],
  },
  "hartley-accounting": {
    title: "Hartley & Co",
    trade: "Accountants",
    blurb: "Decided stock photos of handshakes looked fake and used none at all. The hero is a flat block of colour.",
    credits: [],
  },
  "bright-start-tutoring": {
    title: "Bright Start Tutoring",
    trade: "Private tutor",
    blurb: "Didn't want photographs of other people's children, so the site runs on words alone.",
    credits: [],
  },
};

const META = {
  "corner-bakery": { title: "Corner Bakery", trade: "Bakery", blurb: "One small batch a morning, sold until it's gone. The photos do the selling." },
  "muddy-paws": { title: "Muddy Paws", trade: "Mobile dog groomer", blurb: "A grooming van with no fixed address, so the phone number goes everywhere." },
  "greenline-landscaping": { title: "Greenline Landscaping", trade: "Landscaper", blurb: "Built on an iPad. The gallery of finished gardens is the whole pitch." },
  "lena-marsh-photography": { title: "Lena Marsh Photography", trade: "Photographer", blurb: "Nine photographs at full size, because for a photographer the pictures are the product." },
  "black-iris-tattoo": { title: "Black Iris Tattoo", trade: "Tattoo studio", blurb: "Dark, appointment only, and deliberately missing a services page." },
  "riverside-players": { title: "Riverside Players", trade: "Amateur theatre group", blurb: "A volunteer secretary, a village hall, and fifty years of shows." },
  "still-point-yoga": { title: "Still Point Yoga", trade: "Yoga studio", blurb: "Built entirely on a phone, by someone whose students are all on phones." },
};

/* ---------- 1. photos ---------- */

async function fetchPhotos(slug) {
  const dir = path.join(WORK, slug, "img");
  fs.mkdirSync(dir, { recursive: true });
  const manifest = [];
  const plan = [];
  for (const [keyword, n] of PHOTOS[slug]) for (let i = 1; i <= n; i++) plan.push({ keyword, seed: i });
  const want = 2 + (CONFIGS[slug].content ? CONFIGS[slug].content.gallery.length : CONFIGS[slug].gallery.length);

  let idx = 0;
  for (const { keyword, seed } of plan) {
    if (idx >= want) break;
    const name = idx === 0 ? "hero.jpg" : idx === 1 ? "second.jpg" : `g${idx - 1}.jpg`;
    const isHero = idx === 0;
    const out = path.join(dir, name);
    try {
      const r = await fetchImage({
        keyword, seed, out,
        w: isHero ? 1920 : 1600,
        h: isHero ? 1080 : 1200,
      });
      manifest.push({ file: name, keyword, source: r.source, credit: r.credit, bytes: r.bytes });
      log(` ${slug}/${name} ${r.source} ${Math.round(r.bytes / 1024)}KB ${(r.credit.title || "").slice(0, 46)}`);
      idx++;
    } catch (e) {
      log(` ${slug}/${name} FAILED (${keyword}): ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  // The logo is drawn locally by the QA tooling, so it carries no third-party licence.
  const logoSrc = path.join(STRESS, slug, "img", "logo.png");
  if (CONFIGS[slug].logo && fs.existsSync(logoSrc)) fs.copyFileSync(logoSrc, path.join(dir, "logo.png"));
  fs.writeFileSync(path.join(WORK, slug, "photos.json"), JSON.stringify(manifest, null, 2));
  return manifest;
}

/* ---------- 2. build ---------- */

async function buildSite(slug) {
  const cfg = CONFIGS[slug];
  const outDir = path.join(WORK, slug);
  const imgDir = path.join(outDir, "img");
  const have = fs.readdirSync(imgDir).filter((f) => /^(hero|g\d+)\.jpg$/.test(f));
  const gallery = have.filter((f) => f !== "hero.jpg").sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));

  let basics = cfg.basics;
  let copy = cfg.content;
  if (cfg.copyModule) {
    const m = require(path.join(STRESS, slug, cfg.copyModule));
    basics = { name: m.name, tagline: m.tagline, type: m.type };
    copy = { headline: m.headline, subtext: m.subtext, cta: m.cta, features: m.features, story: m.story, team: m.team, services: m.services, contact: m.contact };
  }
  const content = { ...copy };
  content.hero = fs.existsSync(path.join(imgDir, "hero.jpg")) ? path.join(imgDir, "hero.jpg") : null;
  content.gallery = gallery.map((f) => path.join(imgDir, f));
  const second = path.join(imgDir, "second.jpg");
  if (fs.existsSync(second)) content.secondImage = second;
  if (content.team) content.team = content.team.slice(0, 4);
  if (content.services) content.services = content.services.slice(0, 6);

  const s = await FloorSession.open({ base: BASE, outDir, viewport: cfg.viewport });
  await s.basics(basics); await s.next();
  await s.chooseLayout(cfg.layout); await s.next();
  await s.choosePalette(cfg.palette); await s.next();
  await s.chooseFont(cfg.font); await s.next();
  await s.uploadLogo(cfg.logo && fs.existsSync(path.join(imgDir, "logo.png")) ? path.join(imgDir, "logo.png") : null); await s.next();
  await s.setPages(cfg.pages); await s.next();
  await s.content(content);
  await s.next();
  await s.previewShot("home-desktop", { page: "Home", device: "Desktop" });
  await s.goTo("Download");
  const notices = await s.notices();
  const zip = await s.download();
  await s.close();
  const report = await checkSite({ zip, outDir: path.join(outDir, "final"), screenshots: true });
  log(`${slug}: ${report.passed}/${report.total} checks, ${Math.round(report.bytes / 1024)} KB, notices ${JSON.stringify(notices)}`);
  return report;
}

/* ---------- 3. publish ---------- */

async function creditFor(fileTitle) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent("File:" + fileTitle)}&prop=imageinfo&iiprop=extmetadata`;
  const https = require("node:https");
  const body = await new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "the-floor-qa/1.0 (mileskingdev.com)" } }, (res) => {
      const c = []; res.on("data", (d) => c.push(d)); res.on("end", () => resolve(Buffer.concat(c))); res.on("error", reject);
    }).on("error", reject);
  });
  const pages = Object.values(JSON.parse(body.toString("utf8")).query?.pages || {});
  const m = (pages[0] && pages[0].imageinfo && pages[0].imageinfo[0] && pages[0].imageinfo[0].extmetadata) || {};
  const plain = (h) => String(h || "").replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  return {
    title: fileTitle,
    author: plain(m.Artist && m.Artist.value) || "Unknown",
    license: plain(m.LicenseShortName && m.LicenseShortName.value) || "See file page",
    licenseUrl: plain(m.LicenseUrl && m.LicenseUrl.value) || "",
    filePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent("File:" + fileTitle.replace(/ /g, "_"))}`,
  };
}

async function publish() {
  fs.rmSync(PUBLIC, { recursive: true, force: true });
  fs.mkdirSync(PUBLIC, { recursive: true });
  const entries = [];

  for (const slug of Object.keys(CONFIGS)) {
    const site = path.join(WORK, slug, "final", "site");
    if (!fs.existsSync(site)) { log(`skip ${slug}: not built`); continue; }
    fs.cpSync(site, path.join(PUBLIC, slug), { recursive: true });
    const manifest = JSON.parse(fs.readFileSync(path.join(WORK, slug, "photos.json"), "utf8"));
    const report = JSON.parse(fs.readFileSync(path.join(WORK, slug, "final", "report.json"), "utf8"));
    entries.push({
      slug, ...META[slug],
      layout: CONFIGS[slug].layout, palette: CONFIGS[slug].palette, font: CONFIGS[slug].font,
      pages: ["Home", ...CONFIGS[slug].pages],
      photos: manifest.length,
      sizeKB: Math.round(report.bytes / 1024),
      credits: manifest.filter((m) => m.source === "commons").map((m) => m.credit),
      unsplash: manifest.some((m) => m.source !== "commons"),
    });
  }

  for (const [slug, meta] of Object.entries(PREBUILT)) {
    const workSite = path.join(WORK, slug, "final", "site");
    const site = fs.existsSync(workSite) ? workSite : path.join(STRESS, slug, "final", "site");
    if (!fs.existsSync(site)) { log(`skip ${slug}: no built site`); continue; }
    fs.cpSync(site, path.join(PUBLIC, slug), { recursive: true });
    const base = fs.existsSync(workSite) ? path.join(WORK, slug) : path.join(STRESS, slug);
    const report = JSON.parse(fs.readFileSync(path.join(base, "final", "report.json"), "utf8"));
    const sum = (() => { try { return JSON.parse(fs.readFileSync(path.join(STRESS, slug, "summary.json"), "utf8")); } catch { return null; } })();
    let credits = [];
    const pj = path.join(base, "photos.json");
    if (fs.existsSync(pj)) {
      const m = JSON.parse(fs.readFileSync(pj, "utf8"));
      for (const e of m) credits.push(e.credit && e.credit.author ? e.credit : await creditFor((e.credit || {}).title || ""));
    } else {
      for (const c of meta.credits) credits.push(await creditFor(c.title));
    }
    entries.push({
      slug, title: meta.title, trade: meta.trade, blurb: meta.blurb,
      layout: (sum && sum.layout) || "", palette: (sum && sum.palette) || "", font: (sum && sum.font) || "",
      pages: report.files.filter((f) => f.endsWith(".html")).map((f) => (f === "index.html" ? "Home" : f.replace(".html", "").replace(/^./, (x) => x.toUpperCase()))),
      photos: report.files.filter((f) => /^assets\/(?!fonts)(?!logo)/.test(f)).length,
      sizeKB: Math.round(report.bytes / 1024),
      credits, unsplash: false,
    });
  }

  entries.sort((a, b) => a.title.localeCompare(b.title));
  const out = `// Generated by scripts/build-examples.cjs. Do not edit by hand.
// Ten demo sites, each built through the wizard by someone playing a small
// business owner. The businesses are invented; the sites are the real output.
export interface ExampleCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  filePage: string;
}
export interface Example {
  slug: string;
  title: string;
  trade: string;
  blurb: string;
  layout: string;
  palette: string;
  font: string;
  pages: string[];
  photos: number;
  sizeKB: number;
  credits: ExampleCredit[];
  unsplash: boolean;
}

export const EXAMPLES: readonly Example[] = ${JSON.stringify(entries, null, 2)};
`;
  fs.writeFileSync(path.resolve("src/content/examples.ts"), out);
  log(`published ${entries.length} sites -> public/examples, wrote src/content/examples.ts`);
  const totalMB = entries.reduce((n, e) => n + e.sizeKB, 0) / 1024;
  log(`gallery payload: ${totalMB.toFixed(1)} MB, ${entries.reduce((n, e) => n + e.credits.length, 0)} photos to credit`);
}

(async () => {
  const only = process.argv.includes("--photos");
  const skipFetch = process.argv.includes("--build");
  const onlyPublish = process.argv.includes("--publish");
  const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const targets = slugs.length ? slugs : Object.keys(CONFIGS);
  if (!onlyPublish) {
    for (const slug of targets) {
      log(`--- ${slug}`);
      if (!skipFetch) await fetchPhotos(slug);
      if (!only) await buildSite(slug);
    }
  }
  if (!only) await publish();
})().catch((e) => { console.error(e); process.exit(1); });

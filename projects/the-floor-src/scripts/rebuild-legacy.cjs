// Rebuilds the three sites whose own agents finished them, so the whole
// gallery uses the current templates (gallery-first menu, second image
// section). Their answers are recovered from the sites they already produced,
// and their photos are reused, so nothing about the owner's choices changes.
//
//   FLOOR_BASE=http://127.0.0.1:4322/projects/the-floor/ node scripts/rebuild-legacy.cjs
const path = require("node:path");
const fs = require("node:fs");
const { FloorSession } = require("./floor-driver.cjs");
const { checkSite } = require("./site-check.cjs");
const { fetchImage } = require("./qa-fetch-image.cjs");

const BASE = process.env.FLOOR_BASE || "https://mileskingdev.com/projects/the-floor/";
const STRESS = path.resolve("qa-shots/stress");
const WORK = path.resolve("qa-shots/examples");
const EXTRACTED = path.join(WORK, "_extracted");
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

const SITES = {
  "spoke-and-chain": {
    type: "Trades", palette: "Ocean", font: "Plain", viewport: { width: 390, height: 844 },
    keepHero: true,
    second: {
      keyword: "bicycle workshop", seed: 2,
      title: "The workshop",
      text: "Two benches, a wall of wheels and a parts bin that goes back years. Most repairs happen while you wait, and you're welcome to stand and watch.",
    },
    credits: [
      { file: "hero.jpg", source: "commons", credit: { title: "Munich - Two men working in a Bicycle repair shop - 5893.jpg" } },
      { file: "second.jpg", source: "commons", credit: { title: "Bicycle workshop Ruyigi.JPG" } },
    ],
  },
  "hartley-accounting": {
    type: "Professional", palette: "Navy", font: "Elegant", viewport: { width: 1280, height: 800 },
    hero: { keyword: "office desk paperwork", seed: 1 },
    second: {
      keyword: "desk office window", seed: 1,
      title: "Where your paperwork ends up",
      text: "One office on Gold Street, two desks and a kettle that is always on. Bring the shoebox of receipts if that is what you have. We have seen worse, and we will not make you feel bad about it.",
    },
  },
  "bright-start-tutoring": {
    type: "Professional", palette: "Teal", font: "Modern", viewport: { width: 1280, height: 800 },
    hero: { keyword: "study desk books", seed: 1 },
    second: {
      keyword: "library books shelf", seed: 2,
      title: "Where the tutoring happens",
      text: "A quiet room at the back of the house with a big table, good light and no phones on it. Sessions are one to one, and parents are welcome to sit in for the first one.",
    },
  },
};

/** Copies the photo and logo out of the site the agent already built. */
function reuseAssets(slug) {
  const from = path.join(STRESS, slug, "final", "site", "assets");
  const to = path.join(WORK, slug, "img");
  fs.mkdirSync(to, { recursive: true });
  const out = { hero: null, logo: null };
  // Photos already fetched (and possibly corrected) win over the originals.
  for (const [key, name] of [["hero", "hero.jpg"]]) {
    if (fs.existsSync(path.join(to, name))) out[key] = path.join(to, name);
  }
  if (!fs.existsSync(from)) return out;
  for (const f of fs.readdirSync(from)) {
    if (/^hero-/.test(f)) { fs.copyFileSync(path.join(from, f), path.join(to, "hero.jpg")); out.hero = path.join(to, "hero.jpg"); }
    if (/^logo-/.test(f)) {
      const ext = path.extname(f);
      fs.copyFileSync(path.join(from, f), path.join(to, "logo" + ext));
      out.logo = path.join(to, "logo" + ext);
    }
  }
  return out;
}

(async () => {
  for (const [slug, cfg] of Object.entries(SITES)) {
    const src = path.join(EXTRACTED, `${slug}.json`);
    if (!fs.existsSync(src)) { log(`skip ${slug}: run extract-config.cjs first`); continue; }
    const a = JSON.parse(fs.readFileSync(src, "utf8"));
    const assets = reuseAssets(slug);
    const outDir = path.join(WORK, slug);
    const imgDir = path.join(outDir, "img");
    const pjPath = path.join(outDir, "photos.json");
    const existingCredits = fs.existsSync(pjPath) ? JSON.parse(fs.readFileSync(pjPath, "utf8")) : [];
    const credits = existingCredits.length ? [...existingCredits] : [...(cfg.credits || [])];
    const hasCredit = (file) => credits.some((c) => c.file === file);

    // Everyone gets the second image section: two photographs on a home page
    // is most of what "custom design" means to someone buying a website.
    if (cfg.hero && !assets.hero) {
      const r = await fetchImage({ ...cfg.hero, w: 1920, h: 1080, out: path.join(imgDir, "hero.jpg") });
      assets.hero = r.out;
      if (!hasCredit("hero.jpg")) credits.push({ file: "hero.jpg", source: r.source, credit: r.credit });
      log(` ${slug}/hero.jpg ${r.source} ${(r.credit.title || "").slice(0, 44)}`);
    }
    let secondImage = null;
    const existingSecond = path.join(imgDir, "second.jpg");
    if (cfg.second && fs.existsSync(existingSecond)) {
      secondImage = existingSecond;
    } else if (cfg.second) {
      const r = await fetchImage({ keyword: cfg.second.keyword, seed: cfg.second.seed, w: 1600, h: 1200, out: path.join(imgDir, "second.jpg") });
      secondImage = r.out;
      if (!hasCredit("second.jpg")) credits.push({ file: "second.jpg", source: r.source, credit: r.credit });
      log(` ${slug}/second.jpg ${r.source} ${(r.credit.title || "").slice(0, 44)}`);
    }

    // The menu the agent chose, minus Home, in whatever order the tool now uses.
    const pages = a.pages.filter((p) => p !== "Home");
    const layoutName = { "hero-columns": "Hero + three", split: "Split", banner: "Big image", cards: "Card" }[a.layout] || "Hero + three";
    const tagline = a.tagline || (a.title.includes(" | ") ? a.title.split(" | ").slice(1).join(" | ") : "");

    const s = await FloorSession.open({ base: BASE, outDir, viewport: cfg.viewport });
    await s.basics({ name: a.name, tagline, type: cfg.type }); await s.next();
    await s.chooseLayout(layoutName); await s.next();
    await s.choosePalette(cfg.palette); await s.next();
    await s.chooseFont(cfg.font); await s.next();
    await s.uploadLogo(assets.logo); await s.next();
    await s.setPages(pages); await s.next();
    await s.content({
      headline: a.headline, subtext: a.subtext, cta: a.cta,
      features: a.features,
      hero: assets.hero,
      secondImage,
      secondTitle: cfg.second ? cfg.second.title : undefined,
      secondText: cfg.second ? cfg.second.text : undefined,
      story: a.story,
      team: a.team,
      services: a.services,
      contact: a.contact,
    });
    await s.next();
    await s.previewShot("home-desktop", { page: "Home", device: "Desktop" });
    await s.goTo("Download");
    const notices = await s.notices();
    const zip = await s.download();
    await s.close();
    const report = await checkSite({ zip, outDir: path.join(outDir, "final") });
    fs.writeFileSync(path.join(outDir, "photos.json"), JSON.stringify(credits, null, 2));
    log(`${slug}: ${report.passed}/${report.total} checks, ${Math.round(report.bytes / 1024)} KB, notices ${JSON.stringify(notices)}`);
  }
})().catch((e) => { console.error(e); process.exit(1); });

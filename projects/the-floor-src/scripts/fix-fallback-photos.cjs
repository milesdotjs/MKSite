// Replaces demo photos that fell back to a random-subject source (which
// happens when Wikimedia Commons is rate-limiting) with real topical ones.
// Rewrites photos.json so the credits stay correct.
//
//   node scripts/fix-fallback-photos.cjs [slug ...]
const path = require("node:path");
const fs = require("node:fs");
const { fetchImage } = require("./qa-fetch-image.cjs");

const WORK = path.resolve("qa-shots/examples");
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

/** Keywords that Commons simply has nothing good for, with something it does have. */
const FOR_FILE = {
  "hartley-accounting/second.jpg": "desk office window",
  "greenline-landscaping/second.jpg": "garden patio steps",
  "greenline-landscaping/g4.jpg": "garden hedge",
  "riverside-players/second.jpg": "theatre rehearsal",
  "lena-marsh-photography/g1.jpg": "wedding bouquet flowers",
  "lena-marsh-photography/g8.jpg": "family walking park",
  "black-iris-tattoo/g5.jpg": "tattoo shop",
};

const BETTER = {
  "accounting ledger": "accountant office desk",
  "tattoo parlour": "tattoo studio interior",
  "garden design": "english garden border",
  "wedding ceremony": "wedding ceremony church",
};

(async () => {
  const only = process.argv.slice(2);
  const slugs = fs.readdirSync(WORK).filter((d) => d !== "_extracted" && (!only.length || only.includes(d)));
  for (const slug of slugs) {
    const pj = path.join(WORK, slug, "photos.json");
    if (!fs.existsSync(pj)) continue;
    const manifest = JSON.parse(fs.readFileSync(pj, "utf8"));
    let changed = 0;
    for (const entry of manifest) {
      if (entry.source === "commons") continue;
      const isHero = entry.file === "hero.jpg";
      const keyword = FOR_FILE[`${slug}/${entry.file}`] || BETTER[entry.keyword] || entry.keyword;
      let fixed = false;
      for (let seed = 1; seed <= 6 && !fixed; seed++) {
        try {
          const r = await fetchImage({
            keyword, seed,
            w: isHero ? 1920 : 1600,
            h: isHero ? 1080 : 1200,
            out: path.join(WORK, slug, "img", entry.file),
          });
          if (r.source === "commons") {
            entry.source = r.source;
            entry.credit = r.credit;
            entry.keyword = keyword;
            entry.bytes = r.bytes;
            changed++;
            fixed = true;
            log(` ${slug}/${entry.file} <- ${(r.credit.title || "").slice(0, 52)}`);
          }
        } catch (e) {
          /* try the next seed */
        }
        await new Promise((r) => setTimeout(r, 600));
      }
      if (!fixed) log(` ${slug}/${entry.file} still has no Commons match for "${keyword}"`);
    }
    if (changed) {
      fs.writeFileSync(pj, JSON.stringify(manifest, null, 2));
      log(`${slug}: ${changed} photo(s) replaced`);
    }
  }
})().catch((e) => { console.error(e); process.exit(1); });

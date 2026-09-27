// Builds qa-shots/stress/index.html: one card per persona with the final
// site's home-page thumbnail, the check result, the rating pulled from the
// agent's report.md, and links to the site, the report and the screenshots.
// Usage: node scripts/qa-stress-index.cjs [stressDir]
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(process.argv[2] || "qa-shots/stress");
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const personas = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const cards = [];
const rows = [];
for (const slug of personas) {
  const dir = path.join(root, slug);
  const siteIndex = path.join(dir, "final", "site", "index.html");
  const reportJson = path.join(dir, "final", "report.json");
  const reportMd = path.join(dir, "report.md");
  const thumb = path.join(dir, "final", "disk-index-desktop.png");
  const hasSite = fs.existsSync(siteIndex);
  const rj = fs.existsSync(reportJson) ? JSON.parse(fs.readFileSync(reportJson, "utf8")) : null;
  const md = fs.existsSync(reportMd) ? fs.readFileSync(reportMd, "utf8") : "";
  const sumFile = path.join(dir, "summary.json");
  const sum = fs.existsSync(sumFile) ? JSON.parse(fs.readFileSync(sumFile, "utf8")) : null;
  const title = (md.match(/\*\*Persona\*\*:?\s*([^\n]+)/i) || [])[1] || slug;
  const rating = (md.match(/\b([1-5])\s*(?:\/\s*5|out of 5)\b/i) || md.match(/[Rr]at(?:e|ing)[^0-9]{0,20}([1-5])\b/) || [])[1];
  const verdict = (md.match(/\*\*Verdict\*\*:?\s*([\s\S]*?)(?:\n\s*\n|\n- \*\*)/i) || [])[1] || "";
  const layout = (md.match(/[Ll]ayout:?\s*\**\s*([^,\n*]+)/) || [])[1] || (sum && sum.layout) || "";
  const palette = (md.match(/[Pp]alette:?\s*\**\s*([^,\n*]+)/) || [])[1] || (sum && sum.palette) || "";
  const font = (md.match(/[Ff]ont:?\s*\**\s*([^,\n*]+)/) || [])[1] || (sum && sum.font) || "";
  const check = rj ? `${rj.passed}/${rj.total}` : "no check";
  const kb = rj ? Math.round(rj.bytes / 1024) : null;
  rows.push({ slug, title, rating, check, kb, layout, palette, font, hasSite, problems: rj ? rj.problems.length : null });
  cards.push(`<article class="card${hasSite ? "" : " missing"}">
  <a class="thumb" href="${hasSite ? `${slug}/final/site/` : "#"}">${fs.existsSync(thumb) ? `<img src="${slug}/final/disk-index-desktop.png" alt="">` : "<div class='nothumb'>no screenshot</div>"}</a>
  <div class="body">
    <h2>${esc(title.replace(/^[^:]*:\s*/, "").slice(0, 90))}</h2>
    <p class="meta">${rating ? `<b>${esc(rating)}/5</b> · ` : ""}${esc(check)} checks${kb !== null ? ` · ${kb} KB` : ""}${rj && rj.problems.length ? ` · <span class="bad">${rj.problems.length} problem(s)</span>` : ""}</p>
    <p class="meta">${esc([layout, palette, font].filter(Boolean).join(" · ").slice(0, 110))}</p>
    ${verdict ? `<p class="verdict">${esc(verdict.trim().slice(0, 320))}${verdict.trim().length > 320 ? "…" : ""}</p>` : ""}
    <p class="links">${hasSite ? `<a href="${slug}/final/site/">Open site</a>` : "<span>no site</span>"} · <a href="${slug}/report.md">Report</a> · <a href="${slug}/">Files</a>${rj && rj.readmeWarning ? " · <span class='bad'>README warning</span>" : ""}</p>
  </div>
</article>`);
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Floor stress test</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font:16px/1.5 system-ui,sans-serif;margin:0;padding:2rem;background:#f5f5f3;color:#222}
h1{font-size:2rem;margin:0 0 .25rem}p.lede{color:#555;margin:0 0 2rem}
.grid{display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fill,minmax(320px,1fr))}
.card{background:#fff;border:1px solid #ddd;display:flex;flex-direction:column;overflow:hidden}
.card.missing{opacity:.6}.thumb{display:block;aspect-ratio:16/10;overflow:hidden;background:#eee;border-bottom:1px solid #ddd}
.thumb img{width:100%;height:100%;object-fit:cover;object-position:top}.nothumb{display:grid;place-items:center;height:100%;color:#888}
.body{padding:1rem}h2{font-size:1.1rem;margin:0 0 .35rem}.meta{margin:0 0 .35rem;color:#555;font-size:.9rem}
.verdict{font-size:.92rem;margin:.5rem 0}.links{font-size:.9rem;margin:.5rem 0 0}.bad{color:#b3261e}
table{border-collapse:collapse;margin:2rem 0;background:#fff;font-size:.9rem}td,th{border:1px solid #ddd;padding:.4rem .6rem;text-align:left}
</style></head><body>
<h1>The Floor: ten owners, live site, free photos</h1>
<p class="lede">Each site was built on mileskingdev.com by an agent playing a small-business owner, iterated from the preview, downloaded, then opened from disk and served from a plain static host. Ratings are the owner's own: 1 embarrassing, 3 fine for a template, 5 looks paid-for.</p>
<div class="grid">
${cards.join("\n")}
</div>
<table><tr><th>Persona</th><th>Rating</th><th>Checks</th><th>ZIP</th><th>Layout</th><th>Palette</th><th>Font</th></tr>
${rows.map((r) => `<tr><td><a href="${r.hasSite ? `${r.slug}/final/site/` : "#"}">${esc(r.slug)}</a></td><td>${esc(r.rating || "")}</td><td>${esc(r.check)}${r.problems ? ` (${r.problems} bad)` : ""}</td><td>${r.kb !== null ? r.kb + " KB" : ""}</td><td>${esc(r.layout)}</td><td>${esc(r.palette)}</td><td>${esc(r.font)}</td></tr>`).join("\n")}
</table>
</body></html>`;
fs.writeFileSync(path.join(root, "index.html"), html);
console.log(`${personas.length} personas -> ${path.join(root, "index.html")}`);
for (const r of rows) console.log(`${r.slug.padEnd(24)} rating ${r.rating || "?"}  checks ${r.check.padEnd(7)} ${r.kb !== null ? r.kb + " KB" : ""} ${r.hasSite ? "" : "(no site)"}`);

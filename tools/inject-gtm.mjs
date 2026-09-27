// Makes sure the Google Tag Manager container is on every deployed page.
//
//   node tools/inject-gtm.mjs          # add the tag wherever it's missing
//   node tools/inject-gtm.mjs --check  # only report; exit 1 if any page lacks it
//
// Idempotent: pages that already contain the container id are left alone.
// Skips source folders (*-src, the blackjack source, node_modules) and the
// stray copies that shouldn't be deployed at all. Generated projects also
// carry the tag in their source (Astro layout, Next layout, Vite index.html),
// so a rebuild keeps it; this script is the safety net for everything else.
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ID = "GTM-MC9KF4ZX";
const CHECK = process.argv.includes("--check");

const HEAD_SNIPPET = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${ID}');</script>
<!-- End Google Tag Manager -->`;

const BODY_SNIPPET = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

// Folders under the repo root that are deployed and should carry the tag.
const INCLUDE_TOP = ["index.html", "about.html", "projects.html", "kc", "projects"];

// Anything matching these (as a path segment) is not a deployed page.
const SKIP_SEGMENTS = new Set([
  "node_modules",
  "samples",
  "qa-shots",
  "mockups",
  "tools",
  "assets",
  "MKSite-main",
  "Study Something!", // stray duplicate of study-something
  "blackjack with yugi", // source for anime-blackjack
  ".git",
  ".github",
]);
const SKIP_SUFFIX = ["-src", "-master"];

function isSkipped(rel) {
  return rel.split(sep).some((seg) => SKIP_SEGMENTS.has(seg) || SKIP_SUFFIX.some((s) => seg.endsWith(s)));
}

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(ROOT, full);
    if (isSkipped(rel)) continue;
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) yield full;
  }
}

const targets = [];
for (const top of INCLUDE_TOP) {
  const full = join(ROOT, top);
  try {
    if (statSync(full).isDirectory()) targets.push(...htmlFiles(full));
    else if (top.endsWith(".html")) targets.push(full);
  } catch {
    /* not present */
  }
}

let missing = 0;
let added = 0;
for (const file of targets.sort()) {
  const rel = relative(ROOT, file).split(sep).join("/");
  let html = readFileSync(file, "utf8");
  if (html.includes(ID)) {
    console.log(`ok       ${rel}`);
    continue;
  }
  missing += 1;
  if (CHECK) {
    console.log(`MISSING  ${rel}`);
    continue;
  }
  const head = /<head\b[^>]*>/i.exec(html);
  const body = /<body\b[^>]*>/i.exec(html);
  if (!head || !body) {
    console.log(`SKIP     ${rel} (no <head> or <body> tag)`);
    continue;
  }
  const nl = html.includes("\r\n") ? "\r\n" : "\n";
  const headSnippet = HEAD_SNIPPET.split("\n").join(nl);
  const bodySnippet = BODY_SNIPPET.split("\n").join(nl);
  // Insert the body snippet first so the head offset stays valid.
  const bodyEnd = body.index + body[0].length;
  html = html.slice(0, bodyEnd) + nl + bodySnippet + html.slice(bodyEnd);
  const headEnd = head.index + head[0].length;
  html = html.slice(0, headEnd) + nl + headSnippet + html.slice(headEnd);
  writeFileSync(file, html);
  added += 1;
  console.log(`added    ${rel}`);
}

console.log(`\n${targets.length} pages checked, ${CHECK ? missing + " missing" : added + " tagged now"}.`);
if (CHECK && missing) process.exit(1);

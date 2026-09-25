/**
 * Renders sample sites straight from the generator, one per layout, with
 * and without a hero image, into a folder you can open or screenshot.
 *
 *   npx tsx scripts/render-samples.ts [outDir]
 *
 * Default outDir is ./samples (gitignored). Each sample is a complete site:
 * open index.html by double-clicking, exactly as a user would.
 */

import { mkdirSync, writeFileSync, copyFileSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { generateSite, defaultAnswers, LAYOUTS, PALETTES, FONT_STYLES, type Answers, type ImageAsset } from "../src/lib/generator";

const outRoot = resolve(process.argv[2] ?? "samples");
rmSync(outRoot, { recursive: true, force: true });

/** A landscape SVG that stands in for a photo. */
function fakePhoto(id: string, hue: number, w = 1920, h = 1080): ImageAsset {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue},45%,55%)"/><stop offset="1" stop-color="hsl(${hue + 40},50%,30%)"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<circle cx="${w * 0.7}" cy="${h * 0.35}" r="${h * 0.22}" fill="rgba(255,255,255,0.18)"/>
<path d="M0 ${h*0.7} Q ${w*0.3} ${h*0.6} ${w*0.55} ${h*0.72} T ${w} ${h*0.66} V ${h} H 0 Z" fill="rgba(0,0,0,0.22)"/>
</svg>`;
  return { id, name: `${id}.svg`, type: "image/svg+xml", blob: new Blob([svg], { type: "image/svg+xml" }) };
}

function fakeLogo(): ImageAsset {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" width="240" height="60">
<rect x="4" y="10" width="40" height="40" rx="8" fill="#333"/>
<text x="56" y="40" font-family="Arial" font-size="26" font-weight="bold" fill="#333">BLUE DOOR</text>
</svg>`;
  return { id: "logo", name: "logo.svg", type: "image/svg+xml", blob: new Blob([svg], { type: "image/svg+xml" }) };
}

async function writeSample(name: string, answers: Answers) {
  const dir = resolve(outRoot, name);
  const site = generateSite(answers, { year: 2026 });
  for (const [path, content] of Object.entries(site.files)) {
    const full = resolve(dir, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
  }
  for (const img of site.images) {
    const full = resolve(dir, img.path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, Buffer.from(await img.asset.blob.arrayBuffer()));
  }
  for (const font of site.fonts) {
    const full = resolve(dir, font.path);
    mkdirSync(dirname(full), { recursive: true });
    copyFileSync(resolve("public/fonts", font.file), full);
  }
  console.log(`${name}: ${Object.keys(site.files).length} files, ${site.images.length} images, ${site.fonts.length} fonts`);
}

const types = ["restaurant", "salon", "trades", "professional"] as const;

async function main() {
  let i = 0;
  for (const layout of LAYOUTS) {
    const palette = PALETTES[(i * 3) % PALETTES.length];
    const font = FONT_STYLES[i % FONT_STYLES.length];
    const type = types[i % types.length];

    const bare = { ...defaultAnswers(type), businessName: "Blue Door Café", layout: layout.id, palette: palette.id, fontStyle: font.id };
    bare.pages = ["home", "about", "services", "gallery", "contact"];
    await writeSample(`${layout.id}-bare`, bare);

    const rich = { ...defaultAnswers(type), businessName: "Blue Door Café", layout: layout.id, palette: palette.id, fontStyle: font.id };
    rich.pages = ["home", "about", "services", "gallery", "contact"];
    rich.logo = fakeLogo();
    rich.home = { ...rich.home, heroImage: fakePhoto("hero", 200 + i * 40) };
    rich.gallery = { images: Array.from({ length: 5 }, (_, j) => fakePhoto(`g${j + 1}`, 20 + j * 60, 1600, 1200)) };
    await writeSample(`${layout.id}-rich`, rich);
    i += 1;
  }
  console.log(`Wrote samples to ${outRoot}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

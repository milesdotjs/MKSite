// Copies the woff2 files the generated sites can use out of the Fontsource
// packages and into public/fonts, where both the wizard preview and the ZIP
// builder read them from. Run after `npm install` or when a font is added.
//
// Every font here is licensed under the SIL Open Font License, which permits
// bundling the files inside the downloaded site.
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const wanted = [
  ["@fontsource/montserrat/files/montserrat-latin-400-normal.woff2", "montserrat-400.woff2"],
  ["@fontsource/montserrat/files/montserrat-latin-700-normal.woff2", "montserrat-700.woff2"],
  ["@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2", "playfair-display-400.woff2"],
  ["@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2", "playfair-display-700.woff2"],
  ["@fontsource/pacifico/files/pacifico-latin-400-normal.woff2", "pacifico-400.woff2"],
];

const outDir = resolve("public", "fonts");
mkdirSync(outDir, { recursive: true });

let copied = 0;
for (const [from, to] of wanted) {
  const src = resolve("node_modules", from);
  if (!existsSync(src)) {
    console.error(`Missing ${from}. Did npm install finish?`);
    process.exit(1);
  }
  copyFileSync(src, resolve(outDir, to));
  copied += 1;
}
console.log(`Copied ${copied} font files to public/fonts`);

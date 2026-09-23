// Copies the static export (out/) into the public site folder that GitHub
// Pages serves, mirroring how blackjack's dist/ lives in projects/anime-blackjack/.
import { cpSync, existsSync, rmSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const src = resolve("out");
const dest = resolve("..", "try-not-to-use-bankai");
if (!existsSync(src)) {
  console.error("No out/ folder. Run `npm run build` first.");
  process.exit(1);
}
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.log(`Copied ${src} -> ${dest}`);

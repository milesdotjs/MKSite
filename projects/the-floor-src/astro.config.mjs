// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// The whole MKSite repo is one GitHub Pages deploy, so this app is built
// straight into the sibling folder that Pages serves. Git tracks the folder
// as lowercase `projects/` even though Windows shows it capitalised, and Pages
// is case-sensitive, so `base` must stay lowercase.
const base = process.env.PUBLIC_BASE_PATH ?? "/projects/the-floor";

export default defineConfig({
  site: "https://mileskingdev.com",
  base,
  trailingSlash: "always",
  output: "static",
  outDir: "../the-floor",
  build: {
    format: "directory",
    assets: "_astro",
  },
  integrations: [react()],
  vite: {
    define: {
      "import.meta.env.PUBLIC_BASE_PATH": JSON.stringify(base),
    },
  },
});

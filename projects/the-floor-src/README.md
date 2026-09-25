# The Floor

A free, no-code tool that turns a few clicks into a generic small-business
website, on purpose. The point isn't to make great websites. The point is to
show exactly what an effortless template looks like, so people can recognise
it and refuse to pay thousands for it.

Live at `mileskingdev.com/projects/the-floor/`. No server, no accounts, no AI.
Nothing the user enters leaves their browser.

## Layout

```
the-floor-src/          this folder: the source
../the-floor/           the built site that GitHub Pages serves (astro build writes here)

src/lib/generator/      pure function: (answers) => { files, images, fonts }
  presets/              palettes, font styles, layouts, icons, business-type placeholder copy
  css.ts                the generated site's stylesheet, hand-written, no framework
  pages.ts              page body renderers; every user value is escaped
  shell.ts              <html> wrapper, header with no-JS <details> menu, footer
src/content/            glossary, Reality Check cards, red flags: edit copy here
src/components/wizard/  the React island: ten steps, explainer popover, preview, download
src/lib/                storage (IndexedDB), object URLs, preview builder, ZIP builder
src/pages/              Astro pages: landing, build, glossary, red-flags, for-developers
src/styles/app.css      the tool's own look (white, black, one yellow, Barlow)
public/fonts/           woff2 files bundled into ZIPs when a style needs them
scripts/                font sync, sample renderer, Puppeteer QA drives
```

## Commands

```
npm install
npm run fonts:sync      # copies woff2 files out of the Fontsource packages (run once)
npm run dev             # http://127.0.0.1:4321/projects/the-floor/
npm test                # generator unit tests, including palette contrast
npm run check           # astro type check
npm run build           # writes ../the-floor
```

## Visual QA

The generator is pure, so you can render sample sites without the UI:

```
npx tsx scripts/render-samples.ts samples
node scripts/qa-shoot-samples.cjs samples qa-shots/samples
```

And drive the whole wizard, including uploads, the preview iframe, the ZIP
download and the IndexedDB restore, against a running dev or preview server:

```
node scripts/qa-drive-wizard.cjs http://127.0.0.1:4321/projects/the-floor/ qa-shots/wizard
```

Both scripts load Puppeteer from `Projects/blackjack with yugi/node_modules`,
where it already lives for the rest of this repo.

## Deployment notes

- Git tracks the parent folder as lowercase `projects/` even though Windows
  shows it capitalised. GitHub Pages is case-sensitive, so `base` in
  `astro.config.mjs` stays lowercase and new files should be added with the
  lowercase path.
- The built folder is committed like the other projects in this repo.
  Run `npm run build` before committing.
- The generated sites are meant to look respectable and hollow. If a change
  makes them look either broken or genuinely good, it's the wrong change.

## Splitting off into its own repo

The plan is to move this to its own repository and domain. Nothing in the
code depends on living inside MKSite. When that happens:

1. Copy this folder to the new repo root.
2. In `astro.config.mjs`, set `site` to the new domain, `base` to `"/"`
   (or delete the `PUBLIC_BASE_PATH` logic), and `outDir` to `"dist"`.
3. Point the two QA scripts at a local Puppeteer install (`npm i -D puppeteer`)
   instead of the blackjack project's `node_modules`.
4. Deploy `dist/` to any static host. There's no server to configure.

`withBase()` in `src/lib/base.ts` reads Astro's `BASE_URL`, so every in-app
link and font URL follows the config change without edits.

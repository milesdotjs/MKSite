/**
 * generateSite: the pure core. Answers in, files out.
 */

import type { Answers, GenerateOptions, GeneratedImage, GeneratedPage, GeneratedSite, ImageAsset, PageId } from "./types";
import { ALL_PAGES, MAX_PAGES } from "./types";
import { esc, imageExtension, slug } from "./escape";
import { buildCss, FONT_DIR } from "./css";
import { PAGE_META, PAGE_RENDERERS, type RenderContext } from "./pages";
import { renderDocument } from "./shell";
import { buildReadme } from "./readme";
import { getFontStyle } from "./presets/fontStyles";
import { displayName } from "./defaults";

export * from "./types";
export * from "./defaults";
export { esc, paragraphs, slug } from "./escape";
export { PALETTES, getPalette, contrastRatio, contrastPairs } from "./presets/palettes";
export { FONT_STYLES, getFontStyle } from "./presets/fontStyles";
export { LAYOUTS, getLayout } from "./presets/layouts";
export { BUSINESS_TYPES, getBusinessType } from "./presets/businessTypes";
export { ICONS, ICON_IDS, getIcon } from "./presets/icons";
export { CHAMPION_NAMES, pickChampionNames, randomSeed } from "./presets/champions";
export { PAGE_META } from "./pages";
export { FONT_DIR } from "./css";

/** The enabled pages in canonical order, home always first, capped at MAX_PAGES. */
export function enabledPages(answers: Pick<Answers, "pages">): GeneratedPage[] {
  const wanted = new Set<PageId>(answers.pages);
  wanted.add("home");
  return ALL_PAGES.filter((id) => wanted.has(id))
    .slice(0, MAX_PAGES)
    .map((id) => ({ id, ...PAGE_META[id] }));
}

export function generateSite(answers: Answers, options: GenerateOptions = {}): GeneratedSite {
  const resolveAsset = options.resolveAsset ?? ((p: string) => p);
  const year = options.year ?? new Date().getFullYear();
  const name = displayName(answers);
  const pages = enabledPages(answers);

  const images: GeneratedImage[] = [];
  const seen = new Map<string, string>();
  const useImage = (asset: ImageAsset, prefix: string): string => {
    let path = seen.get(asset.id);
    if (!path) {
      path = `assets/${slug(prefix)}-${slug(asset.id, "img")}.${imageExtension(asset)}`;
      seen.set(asset.id, path);
      images.push({ path, asset });
    }
    return resolveAsset(path, asset);
  };

  const logoUrl = answers.logo ? useImage(answers.logo, "logo") : null;
  const css = buildCss(answers, resolveAsset);
  const styleTag = options.inlineCss ? `<style>\n${css}\n</style>` : `<link rel="stylesheet" href="styles.css">`;

  const ctx: RenderContext = { answers, name, layout: answers.layout, pages, useImage };
  const tagline = answers.tagline.trim();
  const description = tagline || answers.home.subtext;

  const files: Record<string, string> = {};
  for (const page of pages) {
    const body = PAGE_RENDERERS[page.id](ctx);
    const title = page.id === "home" ? (tagline ? `${name} | ${tagline}` : name) : `${page.label} | ${name}`;
    files[page.file] = renderDocument({
      title,
      description,
      layout: answers.layout,
      name,
      logoUrl,
      pages,
      current: page,
      year,
      styleTag,
      body,
    });
  }

  if (!options.inlineCss) {
    files["styles.css"] = css;
  }

  const fonts = getFontStyle(answers.fontStyle).files.map((f) => ({ path: `${FONT_DIR}/${f.file}`, file: f.file }));
  files["README.txt"] = buildReadme(name, pages, fonts.length > 0);

  return { files, pages, images, fonts };
}

/** Convenience for tests and tooling: the escaped display name. */
export function escapedName(answers: Answers): string {
  return esc(displayName(answers));
}

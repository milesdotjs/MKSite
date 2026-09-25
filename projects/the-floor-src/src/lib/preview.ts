/**
 * Builds the site for the in-app preview: CSS inlined (srcdoc can't link a
 * relative stylesheet), images as object URLs, fonts from the app's own
 * public/fonts folder. Page links stay as `about.html` and the preview
 * intercepts clicks on them.
 */

import { generateSite, FONT_DIR, type Answers, type GeneratedSite } from "./generator";
import { urlFor } from "./objectUrls";
import { withBase } from "./base";

export function fontUrl(file: string): string {
  return withBase(`fonts/${file}`);
}

export function buildPreviewSite(answers: Answers): GeneratedSite {
  return generateSite(answers, {
    inlineCss: true,
    resolveAsset: (path, asset) => {
      if (asset) return urlFor(asset);
      if (path.startsWith(`${FONT_DIR}/`)) return fontUrl(path.slice(FONT_DIR.length + 1));
      return path;
    },
  });
}

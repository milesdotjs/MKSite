/**
 * @font-face rules for the bundled fonts, pointing at the app's own
 * public/fonts folder, so the font picker can show live samples. Injected
 * only where it's needed rather than on every page.
 */

import { FONT_STYLES } from "../../lib/generator";
import { fontUrl } from "../../lib/preview";

const css = FONT_STYLES.flatMap((s) => s.files)
  .map(
    (f) =>
      `@font-face{font-family:"${f.family}";font-style:normal;font-weight:${f.weight};font-display:swap;src:url("${fontUrl(f.file)}") format("woff2")}`,
  )
  .join("\n");

export function FontFaces() {
  return <style>{css}</style>;
}

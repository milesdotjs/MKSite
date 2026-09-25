/**
 * Bundles the generated site into a ZIP in the browser. Text files, uploaded
 * images, and the woff2 files the chosen font style needs (fetched from the
 * app's own public/fonts folder, which the preview has usually cached).
 */

import JSZip from "jszip";
import { generateSite, slug, displayName, type Answers, type GeneratedSite } from "./generator";
import { fontUrl } from "./preview";

export interface ZipResult {
  blob: Blob;
  site: GeneratedSite;
  filename: string;
}

export async function buildZip(answers: Answers): Promise<ZipResult> {
  const site = generateSite(answers);
  const zip = new JSZip();

  for (const [path, content] of Object.entries(site.files)) {
    zip.file(path, content);
  }
  for (const img of site.images) {
    zip.file(img.path, img.asset.blob);
  }
  for (const font of site.fonts) {
    const res = await fetch(fontUrl(font.file));
    if (!res.ok) throw new Error(`Couldn't load font ${font.file} (${res.status})`);
    zip.file(font.path, await res.blob());
  }

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
  const filename = `${slug(displayName(answers), "website")}-website.zip`;
  return { blob, site, filename };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

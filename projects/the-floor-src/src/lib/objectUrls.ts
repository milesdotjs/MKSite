/**
 * One object URL per uploaded image, created on demand and revoked when the
 * image is removed or the wizard unmounts. Object URLs don't survive a
 * refresh, so after an IndexedDB restore they're simply created again.
 */

import type { ImageAsset } from "./generator";

const urls = new Map<string, string>();

export function urlFor(asset: ImageAsset): string {
  let url = urls.get(asset.id);
  if (!url) {
    url = URL.createObjectURL(asset.blob);
    urls.set(asset.id, url);
  }
  return url;
}

export function revokeUrl(id: string): void {
  const url = urls.get(id);
  if (url) {
    URL.revokeObjectURL(url);
    urls.delete(id);
  }
}

export function revokeAllUrls(): void {
  for (const url of urls.values()) URL.revokeObjectURL(url);
  urls.clear();
}

/** Wrap a File from an <input type="file"> as an ImageAsset. */
export function assetFromFile(file: File): ImageAsset {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return { id, name: file.name, type: file.type || "application/octet-stream", blob: file };
}

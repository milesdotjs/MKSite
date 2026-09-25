/**
 * HTML escaping. Every user-entered value passes through one of these before
 * it lands in a template. Pasting `<script>` into any field must render as
 * literal text in the generated site.
 */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape for text content and attribute values. */
export function esc(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}

/**
 * Escape a multi-line block of user text into paragraphs. Blank lines split
 * paragraphs; single newlines become line breaks. Returns "" for empty input.
 */
export function paragraphs(value: string | null | undefined): string {
  if (!value) return "";
  const blocks = value
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
  return blocks.map((block) => `<p>${esc(block).replace(/\n/g, "<br>")}</p>`).join("\n");
}

/**
 * Escape a value destined for a `url()` inside generated CSS. Only the
 * characters that could break out of the quoted url are touched.
 */
export function cssUrl(value: string): string {
  return value.replace(/["\\\n\r]/g, (ch) => `\\${ch.charCodeAt(0).toString(16)} `);
}

/** Make a safe, predictable file name fragment from user-supplied text. */
export function slug(value: string, fallback = "file"): string {
  const s = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return s || fallback;
}

/** Pick a file extension from a MIME type or file name. */
export function imageExtension(asset: { name: string; type: string }): string {
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/avif": "avif",
  };
  if (byType[asset.type]) return byType[asset.type];
  const match = /\.([a-z0-9]+)$/i.exec(asset.name);
  return match ? match[1].toLowerCase() : "img";
}

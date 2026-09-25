/**
 * The document shell: doctype, head, header with nav, footer. Identical on
 * every page, which is exactly what a template does.
 */

import type { GeneratedPage, LayoutId } from "./types";
import { esc } from "./escape";

export interface ShellOptions {
  title: string;
  description: string;
  layout: LayoutId;
  name: string;
  /** URL of the uploaded logo, or null for a text wordmark. */
  logoUrl: string | null;
  pages: GeneratedPage[];
  current: GeneratedPage;
  year: number;
  /** Either a <link> to styles.css or an inline <style> block. */
  styleTag: string;
  body: string;
}

function navLinks(pages: GeneratedPage[], current: GeneratedPage): string {
  return pages
    .map((p) => `<a href="${p.file}"${p.id === current.id ? ' aria-current="page"' : ""}>${esc(p.label)}</a>`)
    .join("\n      ");
}

export function renderDocument(o: ShellOptions): string {
  const brand = o.logoUrl
    ? `<img src="${esc(o.logoUrl)}" alt="${esc(o.name)}">`
    : esc(o.name);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.description)}">
  ${o.styleTag}
</head>
<body class="layout-${o.layout}">
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="index.html">${brand}</a>
    <details class="menu-toggle">
      <summary aria-label="Menu"><span class="bars"></span></summary>
    </details>
    <nav class="site-nav" aria-label="Main">
      ${navLinks(o.pages, o.current)}
    </nav>
  </div>
</header>
<main>
${o.body}
</main>
<footer class="site-footer">
  <div class="container footer-inner">
    <p>&copy; ${o.year} ${esc(o.name)}. All rights reserved.</p>
    <nav class="footer-nav" aria-label="Footer">
      ${navLinks(o.pages, o.current)}
    </nav>
  </div>
</footer>
</body>
</html>
`;
}

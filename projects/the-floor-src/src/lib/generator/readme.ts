/**
 * The README that ships inside the ZIP. Plain language for someone who has
 * never put a website online.
 */

import type { GeneratedPage } from "./types";

export function buildReadme(name: string, pages: GeneratedPage[], hasFonts: boolean): string {
  const pageList = pages.map((p) => `  - ${p.file}  (${p.label})`).join("\n");
  return `${name} - your website files
${"=".repeat(name.length + 20)}

This folder is a complete, working website. It was made with The Floor,
a free tool that turns a few clicks into a generic small-business site,
on purpose. Nothing here was written by a developer or by an AI.

WHAT'S IN HERE
--------------
${pageList}
  - styles.css          the colours, fonts and layout
  - assets/             your logo and any pictures you uploaded${hasFonts ? "\n  - assets/fonts/       the fonts the site uses" : ""}
  - README.txt          this file

TO LOOK AT IT
-------------
Double-click index.html. It opens in your web browser, and every menu link
works, straight from this folder. No internet connection needed.

TO PUT IT ONLINE (FREE)
-----------------------
Any "static hosting" service will serve these files for free. The easiest:

  1. Go to https://app.netlify.com/drop
  2. Drag this whole folder onto the page.
  3. You get a web address in a few seconds.

Other free options that work the same way: Cloudflare Pages, GitHub Pages,
Vercel. To use your own domain name (like yourbusiness.com) you buy the
domain from a registrar and point it at the host. Each host has a guide.

WHAT THIS SITE DOESN'T DO
-------------------------
  - The contact form doesn't send anything. It needs a service behind it.
  - Nothing helps people find it on Google beyond the page titles.
  - Your pictures are uploaded exactly as you gave them, not optimised.
  - There's no booking, payments, analytics, or anything specific to
    how your business works.

That's the point. If you're paying someone to build a website, they should
be adding things this site doesn't have. The Reality Check page in the tool
lists what to ask for.

TO CHANGE SOMETHING
-------------------
Go back to The Floor, change your answers, and download again. Or open any
.html file in a text editor: the words are right there in the file.
`;
}

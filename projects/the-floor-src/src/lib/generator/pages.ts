/**
 * Page body renderers. Each returns the HTML inside <main>. Every user value
 * goes through esc() or paragraphs(); nothing is inserted raw.
 */

import type { Answers, GeneratedPage, ImageAsset, LayoutId, PageId } from "./types";
import { MAX_GALLERY_IMAGES, MAX_SERVICES, MAX_TEAM, FEATURE_COUNT } from "./types";
import { esc, paragraphs } from "./escape";
import { getIcon } from "./presets/icons";
import { getBusinessType } from "./presets/businessTypes";

export interface RenderContext {
  answers: Answers;
  /** Display name with fallback. */
  name: string;
  layout: LayoutId;
  pages: GeneratedPage[];
  /** Registers an uploaded image and returns the URL to use for it in HTML. */
  useImage: (asset: ImageAsset, prefix: string) => string;
}

export const PAGE_META: Record<PageId, { file: string; label: string }> = {
  home: { file: "index.html", label: "Home" },
  about: { file: "about.html", label: "About" },
  services: { file: "services.html", label: "Services" },
  gallery: { file: "gallery.html", label: "Gallery" },
  contact: { file: "contact.html", label: "Contact" },
};

function hasPage(ctx: RenderContext, id: PageId): boolean {
  return ctx.pages.some((p) => p.id === id);
}

/** Where the call-to-action buttons point. Contact page if it exists, else email. */
function ctaHref(ctx: RenderContext): string {
  if (hasPage(ctx, "contact")) return PAGE_META.contact.file;
  const email = ctx.answers.contact.email.trim();
  return email ? `mailto:${esc(email)}` : "#";
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}

/* ---------- Home ---------- */

function renderHero(ctx: RenderContext): string {
  const { home } = ctx.answers;
  const tagline = ctx.answers.tagline.trim();
  const heroUrl = home.heroImage ? ctx.useImage(home.heroImage, "hero") : null;
  const button = `<a class="button" href="${ctaHref(ctx)}">${esc(home.ctaText || "Get in touch")}</a>`;

  if (ctx.layout === "split") {
    const media = heroUrl
      ? `<img class="hero-img" src="${esc(heroUrl)}" alt="">`
      : `<div class="hero-img hero-img--placeholder" role="presentation"></div>`;
    return `<section class="hero">
  <div class="container hero-grid">
    <div>
      ${tagline ? `<p class="hero-tagline">${esc(tagline)}</p>` : ""}
      <h1>${esc(home.headline)}</h1>
      <p class="hero-text">${esc(home.subtext)}</p>
      ${button}
    </div>
    ${media}
  </div>
</section>`;
  }

  const bg = heroUrl ? `<img class="hero-bg" src="${esc(heroUrl)}" alt="">` : "";
  return `<section class="hero${heroUrl ? " hero--image" : ""}">
  ${bg}
  <div class="container">
    ${tagline && ctx.layout !== "banner" ? `<p class="hero-tagline">${esc(tagline)}</p>` : ""}
    <h1>${esc(home.headline)}</h1>
    <p class="hero-text">${esc(home.subtext)}</p>
    ${button}
  </div>
</section>`;
}

function renderFeatures(ctx: RenderContext): string {
  const features = ctx.answers.home.features.slice(0, FEATURE_COUNT);
  const items = features
    .map(
      (f) => `<div class="feature">
      <div class="feature-icon">${getIcon(f.icon)}</div>
      <h3>${esc(f.title)}</h3>
      <p>${esc(f.text)}</p>
    </div>`,
    )
    .join("\n    ");

  if (ctx.layout === "banner") {
    return `<section class="features-section">
  <div class="container">
    <div class="features-strip">
      <div class="features">
    ${items}
      </div>
    </div>
  </div>
</section>`;
  }

  const heading =
    ctx.layout === "cards" || ctx.layout === "hero-columns"
      ? `<div class="section-title"><h2>Why choose ${esc(ctx.name)}</h2></div>`
      : `<h2>Why choose ${esc(ctx.name)}</h2>`;

  return `<section class="section features-section">
  <div class="container">
    ${heading}
    <div class="features">
    ${items}
    </div>
  </div>
</section>`;
}

function renderCtaBand(ctx: RenderContext): string {
  const { home } = ctx.answers;
  return `<section class="section cta-band">
  <div class="container">
    <h2>Ready to get started?</h2>
    <p>Get in touch today and find out how ${esc(ctx.name)} can help.</p>
    <a class="button" href="${ctaHref(ctx)}">${esc(home.ctaText || "Get in touch")}</a>
  </div>
</section>`;
}

export function renderHome(ctx: RenderContext): string {
  const parts = [renderHero(ctx), renderFeatures(ctx)];
  parts.push(renderCtaBand(ctx));
  return parts.join("\n");
}

/* ---------- Inner page header ---------- */

function pageHeader(title: string, sub?: string): string {
  return `<section class="page-header">
  <div class="container">
    <h1>${esc(title)}</h1>
    ${sub ? `<p>${esc(sub)}</p>` : ""}
  </div>
</section>`;
}

/* ---------- About ---------- */

export function renderAbout(ctx: RenderContext): string {
  const { about } = ctx.answers;
  const team = about.team
    .slice(0, MAX_TEAM)
    .filter((t) => t.name.trim())
    .map(
      (t) => `<div class="team-member">
      <div class="avatar" aria-hidden="true">${esc(initials(t.name))}</div>
      <div>
        <h3>${esc(t.name)}</h3>
        <p>${esc(t.role)}</p>
      </div>
    </div>`,
    )
    .join("\n    ");

  return `${pageHeader(`About ${ctx.name}`, ctx.answers.tagline)}
<section class="section">
  <div class="container">
    <div class="prose">
      <h2>Our story</h2>
      ${paragraphs(about.story)}
    </div>
  </div>
</section>
${
  team
    ? `<section class="section section--surface">
  <div class="container">
    <div class="section-title"><h2>Meet the team</h2></div>
    <div class="team">
    ${team}
    </div>
  </div>
</section>`
    : ""
}`;
}

/* ---------- Services ---------- */

export function renderServices(ctx: RenderContext): string {
  const items = ctx.answers.services.items
    .slice(0, MAX_SERVICES)
    .filter((s) => s.name.trim())
    .map(
      (s) => `<div class="service">
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.description)}</p>
      ${s.price.trim() ? `<div class="service-price">${esc(s.price)}</div>` : ""}
    </div>`,
    )
    .join("\n    ");

  return `${pageHeader("Our services", "Here's what we can do for you.")}
<section class="section">
  <div class="container">
    <div class="services">
    ${items}
    </div>
  </div>
</section>
${renderCtaBand(ctx)}`;
}

/* ---------- Gallery ---------- */

export function renderGallery(ctx: RenderContext): string {
  const images = ctx.answers.gallery.images.slice(0, MAX_GALLERY_IMAGES);
  let tiles: string;
  if (images.length) {
    tiles = images
      .map((img, i) => `<img src="${esc(ctx.useImage(img, `gallery-${i + 1}`))}" alt="${esc(ctx.name)} photo ${i + 1}">`)
      .join("\n    ");
  } else {
    const hint = getBusinessType(ctx.answers.businessType).galleryHint;
    tiles = Array.from({ length: 6 }, () => `<div class="gallery-placeholder"><div>${getIcon("image")}<div>${esc(hint)}</div></div></div>`).join(
      "\n    ",
    );
  }
  return `${pageHeader("Gallery", "A few pictures of what we do.")}
<section class="section">
  <div class="container">
    <div class="gallery">
    ${tiles}
    </div>
  </div>
</section>`;
}

/* ---------- Contact ---------- */

export function renderContact(ctx: RenderContext): string {
  const { contact } = ctx.answers;
  const rows: string[] = [];
  if (contact.address.trim()) {
    rows.push(`<li>${getIcon("pin")}<div><strong>Address</strong>${paragraphs(contact.address)}</div></li>`);
  }
  if (contact.phone.trim()) {
    const tel = contact.phone.replace(/[^\d+]/g, "");
    rows.push(`<li>${getIcon("phone")}<div><strong>Phone</strong><a href="tel:${esc(tel)}">${esc(contact.phone)}</a></div></li>`);
  }
  if (contact.email.trim()) {
    rows.push(`<li>${getIcon("mail")}<div><strong>Email</strong><a href="mailto:${esc(contact.email.trim())}">${esc(contact.email)}</a></div></li>`);
  }
  if (contact.hours.trim()) {
    rows.push(`<li>${getIcon("clock")}<div><strong>Hours</strong>${paragraphs(contact.hours)}</div></li>`);
  }

  const emailNote = contact.email.trim()
    ? `<p class="muted">Or email us directly at <a href="mailto:${esc(contact.email.trim())}">${esc(contact.email)}</a>.</p>`
    : "";

  return `${pageHeader("Contact us", "We'd love to hear from you.")}
<section class="section">
  <div class="container contact-grid">
    <div>
      <h2>Get in touch</h2>
      <ul class="contact-list">
        ${rows.join("\n        ")}
      </ul>
    </div>
    <div>
      <!--
        This form has no backend. Submitting it does nothing.
        A developer connects it to a service that actually delivers
        the message to you and filters out spam.
      -->
      <form class="contact-form" action="#" method="get" onsubmit="return false">
        <h2>Send a message</h2>
        <label for="contact-name">Your name</label>
        <input id="contact-name" name="name" type="text" autocomplete="name">
        <label for="contact-email">Your email</label>
        <input id="contact-email" name="email" type="email" autocomplete="email">
        <label for="contact-message">Message</label>
        <textarea id="contact-message" name="message"></textarea>
        <button class="button" type="submit">Send message</button>
      </form>
      ${emailNote}
    </div>
  </div>
</section>`;
}

export const PAGE_RENDERERS: Record<PageId, (ctx: RenderContext) => string> = {
  home: renderHome,
  about: renderAbout,
  services: renderServices,
  gallery: renderGallery,
  contact: renderContact,
};

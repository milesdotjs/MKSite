/**
 * Default answers. Every wizard step is skippable, and skipping falls back to
 * these, so a user who types nothing but their business name still gets a
 * complete site.
 */

import type { Answers, BusinessType } from "./types";
import { DEFAULT_BUSINESS_TYPE, getBusinessType } from "./presets/businessTypes";
import { DEFAULT_LAYOUT_ID } from "./presets/layouts";
import { DEFAULT_PALETTE_ID } from "./presets/palettes";
import { DEFAULT_FONT_STYLE_ID } from "./presets/fontStyles";
import { pickChampionNames, randomSeed } from "./presets/champions";

export const PLACEHOLDER_ADDRESS = "123 Main Street\nYour Town, ST 12345";
export const PLACEHOLDER_PHONE = "(555) 123-4567";
export const PLACEHOLDER_EMAIL = "hello@example.com";

/** Content fields that the business type preset fills in. */
export function placeholderContent(type: BusinessType, seed: number): Pick<Answers, "tagline" | "home" | "about" | "services" | "contact"> {
  const preset = getBusinessType(type);
  const names = pickChampionNames(seed, preset.teamRoles.length);
  return {
    tagline: preset.tagline,
    home: {
      heroImage: null,
      headline: preset.headline,
      subtext: preset.subtext,
      features: preset.features.map((f) => ({ ...f })),
      ctaText: preset.ctaText,
      secondImage: null,
      secondTitle: preset.secondTitle,
      secondText: preset.secondText,
    },
    about: {
      story: preset.story,
      team: preset.teamRoles.map((role, i) => ({ name: names[i] ?? "", role })),
    },
    services: {
      items: preset.services.map((s) => ({ ...s })),
    },
    contact: {
      address: PLACEHOLDER_ADDRESS,
      phone: PLACEHOLDER_PHONE,
      email: PLACEHOLDER_EMAIL,
      hours: preset.hours,
    },
  };
}

export function defaultAnswers(type: BusinessType = DEFAULT_BUSINESS_TYPE, seed: number = randomSeed()): Answers {
  return {
    seed,
    businessName: "",
    businessType: type,
    layout: DEFAULT_LAYOUT_ID,
    palette: DEFAULT_PALETTE_ID,
    fontStyle: DEFAULT_FONT_STYLE_ID,
    logo: null,
    pro: false,
    pages: ["home", "about", "services", "contact"],
    gallery: { images: [] },
    ...placeholderContent(type, seed),
  };
}

/**
 * Swap the placeholder copy for a new business type, but only for fields the
 * user hasn't changed from the old placeholder. Their own words survive.
 */
export function retypeAnswers(answers: Answers, newType: BusinessType): Answers {
  if (answers.businessType === newType) return answers;
  const oldP = placeholderContent(answers.businessType, answers.seed);
  const newP = placeholderContent(newType, answers.seed);
  const keep = <T>(current: T, oldDefault: T, newDefault: T): T =>
    JSON.stringify(current) === JSON.stringify(oldDefault) ? newDefault : current;

  return {
    ...answers,
    businessType: newType,
    tagline: keep(answers.tagline, oldP.tagline, newP.tagline),
    home: {
      ...answers.home,
      headline: keep(answers.home.headline, oldP.home.headline, newP.home.headline),
      subtext: keep(answers.home.subtext, oldP.home.subtext, newP.home.subtext),
      features: keep(answers.home.features, oldP.home.features, newP.home.features),
      ctaText: keep(answers.home.ctaText, oldP.home.ctaText, newP.home.ctaText),
      secondTitle: keep(answers.home.secondTitle, oldP.home.secondTitle, newP.home.secondTitle),
      secondText: keep(answers.home.secondText, oldP.home.secondText, newP.home.secondText),
    },
    about: {
      story: keep(answers.about.story, oldP.about.story, newP.about.story),
      team: keep(answers.about.team, oldP.about.team, newP.about.team),
    },
    services: {
      items: keep(answers.services.items, oldP.services.items, newP.services.items),
    },
    contact: {
      ...answers.contact,
      hours: keep(answers.contact.hours, oldP.contact.hours, newP.contact.hours),
    },
  };
}

/**
 * True when the user has written any of their own text (as opposed to
 * leaving the placeholder copy in place). Used by the Reality Check.
 */
export function hasCustomText(answers: Answers): boolean {
  const p = placeholderContent(answers.businessType, answers.seed);
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  return !(
    same(answers.tagline, p.tagline) &&
    same(answers.home.headline, p.home.headline) &&
    same(answers.home.subtext, p.home.subtext) &&
    same(answers.home.features, p.home.features) &&
    same(answers.home.ctaText, p.home.ctaText) &&
    same(answers.home.secondTitle, p.home.secondTitle) &&
    same(answers.home.secondText, p.home.secondText) &&
    same(answers.about.story, p.about.story) &&
    same(answers.about.team, p.about.team) &&
    same(answers.services.items, p.services.items) &&
    same(answers.contact, p.contact)
  );
}

/**
 * Which parts of the site still carry placeholder text, as plain labels.
 * Empty means the user replaced everything. Used by the Reality Check, the
 * Download step and the README, so nobody puts "(555) 123-4567" online by
 * accident.
 */
export function placeholderFields(answers: Answers): string[] {
  const p = placeholderContent(answers.businessType, answers.seed);
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  const out: string[] = [];
  if (same(answers.tagline, p.tagline)) out.push("tagline");
  if (same(answers.home.headline, p.home.headline)) out.push("home page headline");
  if (same(answers.home.subtext, p.home.subtext)) out.push("home page text");
  if (same(answers.home.features, p.home.features)) out.push("the three reasons to choose you");
  if (same(answers.home.ctaText, p.home.ctaText)) out.push("button text");
  if (answers.home.secondImage && same(answers.home.secondTitle, p.home.secondTitle) && same(answers.home.secondText, p.home.secondText))
    out.push("the second home page section");
  if (answers.pages.includes("about")) {
    if (same(answers.about.story, p.about.story)) out.push("your story");
    if (answers.about.team.length && same(answers.about.team, p.about.team)) out.push("team names");
  }
  if (answers.pages.includes("services") && same(answers.services.items, p.services.items)) out.push("services and prices");
  if (answers.pages.includes("contact")) {
    const c = answers.contact;
    const contactBits: string[] = [];
    if (c.address.trim() === PLACEHOLDER_ADDRESS) contactBits.push("address");
    if (c.phone.trim() === PLACEHOLDER_PHONE) contactBits.push("phone number");
    if (c.email.trim() === PLACEHOLDER_EMAIL) contactBits.push("email address");
    if (contactBits.length) out.push(contactBits.join(", "));
    if (same(c.hours, p.contact.hours)) out.push("opening hours");
  }
  return out;
}

/** The subset of placeholderFields that would actively mislead a visitor. */
export function misleadingPlaceholders(answers: Answers): string[] {
  return placeholderFields(answers).filter((f) => /address|phone|email|opening hours|team names/.test(f));
}

/**
 * One plain sentence (without a trailing full stop) describing the made-up
 * things still in the site, or null when there are none. Shared by the
 * Download step and the README so the wording matches.
 */
export function misleadingSummary(answers: Answers): string | null {
  const items = misleadingPlaceholders(answers);
  if (!items.length) return null;
  const contact = items.filter((i) => i !== "team names");
  const parts: string[] = [];
  if (contact.length) {
    const bits = contact.join(", ").replace(/, ([^,]+)$/, " and $1");
    parts.push(`the contact page still shows the made-up ${bits}`);
  }
  if (items.includes("team names")) {
    const n = answers.about.team.length;
    parts.push(`the about page still lists ${n === 1 ? "a made-up team member" : `${n} made-up team members`}`);
  }
  return parts.join(", and ");
}

/** "restaurant or café", "shop", "business": how to name the type in a sentence. */
export function typeNoun(answers: Pick<Answers, "businessType">): string {
  return getBusinessType(answers.businessType).noun;
}

/** Display name, falling back so templates never render an empty brand. */
export function displayName(answers: Pick<Answers, "businessName">): string {
  return answers.businessName.trim() || "Your Business";
}

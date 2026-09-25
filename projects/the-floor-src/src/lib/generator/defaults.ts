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

export const PLACEHOLDER_ADDRESS = "123 Main Street\nYour Town, ST 12345";
export const PLACEHOLDER_PHONE = "(555) 123-4567";
export const PLACEHOLDER_EMAIL = "hello@example.com";

/** Content fields that the business type preset fills in. */
export function placeholderContent(type: BusinessType): Pick<Answers, "tagline" | "home" | "about" | "services" | "contact"> {
  const preset = getBusinessType(type);
  return {
    tagline: preset.tagline,
    home: {
      heroImage: null,
      headline: preset.headline,
      subtext: preset.subtext,
      features: preset.features.map((f) => ({ ...f })),
      ctaText: preset.ctaText,
    },
    about: {
      story: preset.story,
      team: preset.team.map((t) => ({ ...t })),
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

export function defaultAnswers(type: BusinessType = DEFAULT_BUSINESS_TYPE): Answers {
  return {
    businessName: "",
    businessType: type,
    layout: DEFAULT_LAYOUT_ID,
    palette: DEFAULT_PALETTE_ID,
    fontStyle: DEFAULT_FONT_STYLE_ID,
    logo: null,
    pages: ["home", "about", "services", "contact"],
    gallery: { images: [] },
    ...placeholderContent(type),
  };
}

/**
 * Swap the placeholder copy for a new business type, but only for fields the
 * user hasn't changed from the old placeholder. Their own words survive.
 */
export function retypeAnswers(answers: Answers, newType: BusinessType): Answers {
  if (answers.businessType === newType) return answers;
  const oldP = placeholderContent(answers.businessType);
  const newP = placeholderContent(newType);
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
  const p = placeholderContent(answers.businessType);
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  return !(
    same(answers.tagline, p.tagline) &&
    same(answers.home.headline, p.home.headline) &&
    same(answers.home.subtext, p.home.subtext) &&
    same(answers.home.features, p.home.features) &&
    same(answers.home.ctaText, p.home.ctaText) &&
    same(answers.about.story, p.about.story) &&
    same(answers.about.team, p.about.team) &&
    same(answers.services.items, p.services.items) &&
    same(answers.contact, p.contact)
  );
}

/** Display name, falling back so templates never render an empty brand. */
export function displayName(answers: Pick<Answers, "businessName">): string {
  return answers.businessName.trim() || "Your Business";
}

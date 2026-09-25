import {
  enabledPages,
  getBusinessType,
  getFontStyle,
  getLayout,
  getPalette,
  hasCustomText,
} from "../../../lib/generator";
import { CLOSING_LINE, REALITY_CHECK, TIERS, type Tier } from "../../../content/realityCheck";
import { withBase } from "../../../lib/base";
import type { StepProps } from "../types";

export function RealityStep({ answers }: StepProps) {
  const pages = enabledPages(answers);
  const layout = getLayout(answers.layout);
  const palette = getPalette(answers.palette);
  const font = getFontStyle(answers.fontStyle);
  const custom = hasCustomText(answers);
  const type = getBusinessType(answers.businessType).name.toLowerCase();
  const photos = (answers.home.heroImage ? 1 : 0) + answers.gallery.images.length;

  const got: string[] = [
    `${pages.length === 1 ? "One page" : `${pages.length} pages`}: ${pages.map((p) => p.label.toLowerCase()).join(", ")}`,
    `Layout: ${layout.name.toLowerCase()}`,
    `Colours: ${palette.name}`,
    `Fonts: ${font.name.toLowerCase()} (${font.detail.toLowerCase()})`,
    answers.logo ? "Your logo in the header" : "Your name as a text logo",
    custom ? "Your words, exactly as you typed them" : `Placeholder words for a ${type}, because you didn't change them`,
    photos ? `${photos} ${photos === 1 ? "photo" : "photos"}, exactly as uploaded` : "No photos, so flat colour where they'd go",
    "Works on phones, tablets and desktops",
    "Plain HTML and CSS. Opens by double-clicking, hosts for free",
  ];

  const tiers: Tier[] = ["essential", "depends"];

  return (
    <>
      <h1>Reality check</h1>
      <p className="lede">
        This is the most important screen. The left column is what you just made for nothing. The right column is what you'd pay for.
      </p>
      <div className="reality">
        <div>
          <h2>What you just got for free</h2>
          <ul className="got-list">
            {got.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <p className="muted small" style={{ marginTop: "1rem" }}>
            Time taken: about five minutes. Skill required: none. AI used: none.
          </p>
        </div>
        <div>
          <h2>What a developer worth paying should add</h2>
          {tiers.map((tier) => (
            <div key={tier} className="tier">
              <h3>{TIERS[tier].title}</h3>
              <p>{TIERS[tier].intro}</p>
              {REALITY_CHECK.filter((c) => c.tier === tier).map((c) => (
                <details key={c.id} className="card">
                  <summary>{c.title}</summary>
                  <div className="card-body">
                    <p>{c.why}</p>
                    <h4>Ask a developer</h4>
                    <ul>
                      {c.questions.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="closing">
        <p>{CLOSING_LINE}</p>
      </div>
      <p style={{ marginTop: "1.5rem" }}>
        Hiring someone? Read the <a href={withBase("red-flags/")} target="_blank" rel="noopener">red flags</a> first.
      </p>
    </>
  );
}

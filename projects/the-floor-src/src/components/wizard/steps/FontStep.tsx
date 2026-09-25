import { FONT_STYLES, displayName } from "../../../lib/generator";
import { Explainer } from "../Explainer";
import { FontFaces } from "../FontFaces";
import type { StepProps } from "../types";

export function FontStep({ answers, setAnswers }: StepProps) {
  const name = displayName(answers);
  return (
    <>
      <FontFaces />
      <h1>Pick a font style</h1>
      <p className="lede">
        Five looks. Each is a heading font and a body font that go together, so the festive one is still readable. <Explainer term="font-pairing" />
      </p>
      <ul className="choices choices--2" role="group" aria-label="Font style">
        {FONT_STYLES.map((f) => (
          <li key={f.id}>
            <button type="button" className="choice" aria-pressed={answers.fontStyle === f.id} onClick={() => setAnswers((a) => ({ ...a, fontStyle: f.id }))}>
              <span className="font-sample" aria-hidden="true">
                <span className="font-sample-heading" style={{ fontFamily: f.headingFamily, fontWeight: f.headingWeight }}>
                  Welcome to {name}
                </span>
                <span className="font-sample-body" style={{ fontFamily: f.bodyFamily }}>
                  Open seven days. Call us or drop in, we'd love to see you.
                </span>
              </span>
              <span className="choice-title">{f.name}</span>
              <span className="choice-desc">{f.detail}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

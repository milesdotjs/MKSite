import { BUSINESS_TYPES, retypeAnswers, type BusinessType } from "../../../lib/generator";
import { Explainer } from "../Explainer";
import type { StepProps } from "../types";

export function BasicsStep({ answers, setAnswers }: StepProps) {
  return (
    <>
      <h1>What's the business called?</h1>
      <p className="lede">The name goes in the header, the footer, and the browser tab. Everything else on this screen can be skipped.</p>

      <div className="field">
        <div className="field-label">
          <label htmlFor="business-name">Business name</label>
        </div>
        <input
          id="business-name"
          className="input"
          type="text"
          autoComplete="organization"
          value={answers.businessName}
          onChange={(e) => setAnswers((a) => ({ ...a, businessName: e.target.value }))}
          placeholder="Blue Door Café"
          required
        />
      </div>

      <div className="field">
        <div className="field-label">
          <label htmlFor="tagline">Tagline</label>
          <Explainer term="tagline" />
        </div>
        <input
          id="tagline"
          className="input"
          type="text"
          value={answers.tagline}
          onChange={(e) => setAnswers((a) => ({ ...a, tagline: e.target.value }))}
        />
        <span className="field-hint">Under ten words. Say what you do.</span>
      </div>

      <div className="field">
        <div className="field-label" id="business-type-label">
          What kind of business is it?
        </div>
        <span className="field-hint" style={{ marginBottom: "0.75rem" }}>
          This only picks the placeholder words and icons. You can change any of them later.
        </span>
        <ul className="choices choices--3" role="group" aria-labelledby="business-type-label">
          {BUSINESS_TYPES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                className="choice"
                aria-pressed={answers.businessType === t.id}
                onClick={() => setAnswers((a) => retypeAnswers(a, t.id as BusinessType))}
              >
                <span className="choice-title" style={{ marginTop: 0 }}>
                  {t.name}
                </span>
                <span className="choice-desc">"{t.tagline}"</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

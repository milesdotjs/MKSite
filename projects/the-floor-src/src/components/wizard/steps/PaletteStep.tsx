import { PALETTES } from "../../../lib/generator";
import { Explainer } from "../Explainer";
import type { StepProps } from "../types";

export function PaletteStep({ answers, setAnswers }: StepProps) {
  return (
    <>
      <h1>Pick your colours</h1>
      <p className="lede">
        Ten presets, no colour picker. Limited choice is part of the point. <Explainer term="color-palette" />
      </p>
      <ul className="choices choices--3" role="group" aria-label="Colour palette">
        {PALETTES.map((p) => (
          <li key={p.id}>
            <button type="button" className="choice" aria-pressed={answers.palette === p.id} onClick={() => setAnswers((a) => ({ ...a, palette: p.id }))}>
              <span className="swatches" aria-hidden="true">
                <span style={{ background: p.colors.primary }} />
                <span style={{ background: p.colors.accent }} />
                <span style={{ background: p.colors.surface }} />
                <span style={{ background: p.colors.text }} />
              </span>
              <span className="choice-title">{p.name}</span>
              <span className="choice-desc">{p.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

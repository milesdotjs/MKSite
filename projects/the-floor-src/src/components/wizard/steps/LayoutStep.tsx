import { LAYOUTS } from "../../../lib/generator";
import type { StepProps } from "../types";

export function LayoutStep({ answers, setAnswers }: StepProps) {
  return (
    <>
      <h1>Pick a layout</h1>
      <p className="lede">Four to choose from, all deliberately stock. You've seen every one of these a thousand times. That's the point.</p>
      <ul className="choices choices--2" role="group" aria-label="Layout">
        {LAYOUTS.map((l) => (
          <li key={l.id}>
            <button type="button" className="choice" aria-pressed={answers.layout === l.id} onClick={() => setAnswers((a) => ({ ...a, layout: l.id }))}>
              <span className="choice-thumb" dangerouslySetInnerHTML={{ __html: l.thumbnail }} />
              <span className="choice-title">{l.name}</span>
              <span className="choice-desc">{l.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

import { Preview } from "../Preview";
import { Explainer } from "../Explainer";
import type { StepProps } from "../types";

export function PreviewStep({ answers, setAnswers }: StepProps) {
  const setPro = (pro: boolean) => setAnswers((a) => ({ ...a, pro }));

  return (
    <>
      <h1>Here it is</h1>
      <p className="lede">
        Click the menu links to move between pages. Try the phone view. If something's wrong, go back and change it.{" "}
        <Explainer term="responsive" />
      </p>

      {answers.pro ? (
        <div className="notice notice--tape pro-reveal" role="status">
          <p>
            <strong>That's the upgrade.</strong> Scroll the preview. Hover over the cards. Then notice that your site can't do a single
            thing it couldn't do a second ago.
          </p>
          <p>
            This is what "animations", "modern interactions" and "polish" mean when they appear on a quote. It took you one click. If
            someone is charging you for it, they are charging you for a click.
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn--ghost" onClick={() => setPro(false)}>
              Turn it off again
            </button>
          </div>
        </div>
      ) : (
        <div className="pro-offer">
          <div className="pro-offer-text">
            <p className="pro-eyebrow">Upgrade available</p>
            <h2>Upgrade to Pro</h2>
            <p>
              Things fade in as you scroll. Cards lift when you hover. The menu underlines itself. The header casts a shadow once you
              move. Everything a "premium" template has.
            </p>
          </div>
          <div className="pro-offer-cta">
            <button type="button" className="btn btn--tape btn--big" onClick={() => setPro(true)}>
              Upgrade to Pro
            </button>
            <span className="pro-price">Free. Obviously.</span>
          </div>
        </div>
      )}

      <Preview answers={answers} />
    </>
  );
}

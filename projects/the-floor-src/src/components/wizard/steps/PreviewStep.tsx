import { Preview } from "../Preview";
import { Explainer } from "../Explainer";
import type { StepProps } from "../types";

export function PreviewStep({ answers }: StepProps) {
  return (
    <>
      <h1>Here it is</h1>
      <p className="lede">
        Click the menu links to move between pages. Try the phone view. If something's wrong, go back and change it.{" "}
        <Explainer term="responsive" />
      </p>
      <Preview answers={answers} />
    </>
  );
}

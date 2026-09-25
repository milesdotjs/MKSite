import { displayName } from "../../../lib/generator";
import { Explainer } from "../Explainer";
import { ImageUpload } from "../ImageUpload";
import type { StepProps } from "../types";

export function LogoStep({ answers, setAnswers }: StepProps) {
  return (
    <>
      <h1>Got a logo?</h1>
      <p className="lede">
        Optional. If you skip this, the site uses "{displayName(answers)}" in the heading font as a wordmark, which is what most template sites do
        anyway.
      </p>
      <ImageUpload
        id="logo-upload"
        label={
          <>
            Logo <Explainer term="logo" />
          </>
        }
        hint="PNG or SVG with a transparent background works best. Wide logos fit a header better than tall ones. It stays in your browser."
        value={answers.logo}
        onChange={(logo) => setAnswers((a) => ({ ...a, logo }))}
      />
    </>
  );
}

import type { ComponentType } from "react";
import type { StepId, StepProps } from "../types";
import { BasicsStep } from "./BasicsStep";
import { LayoutStep } from "./LayoutStep";
import { PaletteStep } from "./PaletteStep";
import { FontStep } from "./FontStep";
import { LogoStep } from "./LogoStep";
import { PagesStep } from "./PagesStep";
import { ContentStep } from "./ContentStep";
import { PreviewStep } from "./PreviewStep";
import { RealityStep } from "./RealityStep";
import { DownloadStep } from "./DownloadStep";

export interface StepDef {
  id: StepId;
  /** Short label for the progress line. */
  title: string;
  Component: ComponentType<StepProps>;
}

export const STEPS: readonly StepDef[] = [
  { id: "basics", title: "Basics", Component: BasicsStep },
  { id: "layout", title: "Layout", Component: LayoutStep },
  { id: "palette", title: "Colours", Component: PaletteStep },
  { id: "font", title: "Fonts", Component: FontStep },
  { id: "logo", title: "Logo", Component: LogoStep },
  { id: "pages", title: "Pages", Component: PagesStep },
  { id: "content", title: "Your words", Component: ContentStep },
  { id: "preview", title: "Preview", Component: PreviewStep },
  { id: "reality", title: "Reality check", Component: RealityStep },
  { id: "download", title: "Download", Component: DownloadStep },
];

import type { Dispatch, SetStateAction } from "react";
import type { Answers } from "../../lib/generator";

export interface StepProps {
  answers: Answers;
  setAnswers: Dispatch<SetStateAction<Answers>>;
  /** Wipes everything and returns to step one. */
  startOver: () => void;
  /** Jump to a step by id. */
  goTo: (id: StepId) => void;
}

export type StepId = "basics" | "layout" | "palette" | "font" | "logo" | "pages" | "content" | "preview" | "reality" | "download";

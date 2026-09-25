import { ALL_PAGES, PAGE_META, type PageId } from "../../../lib/generator";
import { Explainer } from "../Explainer";
import type { StepProps } from "../types";

const BLURBS: Record<PageId, string> = {
  home: "Always included. The big picture, three reasons to choose you, and a button.",
  about: "Your story and, if you like, who's on the team.",
  services: "What you offer, with an optional price on each.",
  gallery: "Up to nine photos in a grid.",
  contact: "Address, phone, email, hours, and a form that doesn't send anything.",
};

export function PagesStep({ answers, setAnswers }: StepProps) {
  function toggle(id: PageId, on: boolean) {
    setAnswers((a) => {
      const set = new Set(a.pages);
      if (on) set.add(id);
      else set.delete(id);
      set.add("home");
      return { ...a, pages: ALL_PAGES.filter((p) => set.has(p)) };
    });
  }

  return (
    <>
      <h1>Which pages?</h1>
      <p className="lede">
        Up to five. Each one becomes a link in the menu. <Explainer term="navigation" />
      </p>
      <div className="stack" style={{ "--stack": "0.75rem" } as React.CSSProperties}>
        {ALL_PAGES.map((id) => {
          const locked = id === "home";
          const on = locked || answers.pages.includes(id);
          return (
            <label key={id} className="check">
              <input type="checkbox" checked={on} disabled={locked} onChange={(e) => toggle(id, e.target.checked)} />
              <span>
                <strong>{PAGE_META[id].label}</strong>
                <span>{BLURBS[id]}</span>
              </span>
            </label>
          );
        })}
      </div>
    </>
  );
}

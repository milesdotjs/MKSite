/**
 * The wizard. One question per screen, back and next, every step skippable.
 * State lives in memory and is autosaved to IndexedDB so a refresh doesn't
 * lose work. Nothing leaves the browser.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { defaultAnswers, type Answers } from "../../lib/generator";
import { clearState, loadState, saveState } from "../../lib/storage";
import { revokeAllUrls } from "../../lib/objectUrls";
import { STEPS } from "./steps";
import type { StepId } from "./types";

export default function Wizard() {
  const [answers, setAnswers] = useState<Answers>(() => defaultAnswers());
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [restored, setRestored] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Restore on mount.
  useEffect(() => {
    let cancelled = false;
    loadState().then((saved) => {
      if (cancelled) return;
      if (saved) {
        setAnswers(saved.answers);
        setStep(Math.min(Math.max(saved.step, 0), STEPS.length - 1));
        setRestored(true);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
      revokeAllUrls();
    };
  }, []);

  // Autosave, debounced.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => void saveState(answers, step), 300);
    return () => clearTimeout(t);
  }, [answers, step, ready]);

  // On step change: scroll up and move focus to the step heading.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const startOver = useCallback(() => {
    if (!window.confirm("Erase everything you've entered, including pictures, and start again?")) return;
    void clearState();
    revokeAllUrls();
    setAnswers(defaultAnswers());
    setStep(0);
    setRestored(false);
  }, []);

  const goTo = useCallback((id: StepId) => {
    const idx = STEPS.findIndex((s) => s.id === id);
    if (idx >= 0) setStep(idx);
  }, []);

  if (!ready) {
    return (
      <div className="wrap section" aria-busy="true">
        <p className="muted">Loading your answers from this browser.</p>
      </div>
    );
  }

  const current = STEPS[step];
  const Step = current.Component;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const canProceed = current.id !== "basics" || answers.businessName.trim().length > 0;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="wizard">
      <div className="wizard-progress">
        <div className="wrap">
          <span>
            Step {step + 1} of {STEPS.length}: <strong>{current.title}</strong>
          </span>
          <button type="button" className="link-btn small" onClick={startOver}>
            Start over
          </button>
        </div>
        <div className="wizard-progress-bar" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Progress">
          <div className="wizard-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="wrap wizard-step">
        {restored && step > 0 && (
          <div className="notice notice--tape" role="status">
            <p>Welcome back. Your answers were saved in this browser, so you're picking up where you left off.</p>
          </div>
        )}
        <div ref={headingRef} tabIndex={-1} style={{ outline: "none" }}>
          <Step answers={answers} setAnswers={setAnswers} startOver={startOver} goTo={goTo} />
        </div>
      </div>

      <nav className="wizard-nav" aria-label="Wizard">
        <div className="wrap">
          <button type="button" className="btn btn--ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={isFirst}>
            Back
          </button>
          <div className="wizard-nav-right">
            {!isLast && (
              <button
                type="button"
                className={`btn ${current.id === "reality" ? "btn--tape" : ""}`}
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                disabled={!canProceed}
                title={canProceed ? undefined : "Enter a business name first"}
              >
                {current.id === "preview" ? "Looks fine, what's missing?" : current.id === "reality" ? "Download the ZIP" : "Next"}
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

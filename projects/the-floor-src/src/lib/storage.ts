/**
 * Autosave to IndexedDB in the user's own browser. Blobs go in as-is
 * (structured clone handles them), so uploaded images survive a refresh.
 * Nothing is sent anywhere.
 */

import { get, set, del } from "idb-keyval";
import { defaultAnswers, type Answers } from "./generator";

const KEY = "the-floor:state:v1";

export interface SavedState {
  answers: Answers;
  step: number;
  savedAt: number;
}

export async function saveState(answers: Answers, step: number): Promise<void> {
  try {
    await set(KEY, { answers, step, savedAt: Date.now() } satisfies SavedState);
  } catch (err) {
    // Private mode or blocked storage. The session still works; it just won't survive a refresh.
    console.warn("Autosave failed", err);
  }
}

export async function loadState(): Promise<SavedState | null> {
  try {
    const raw = (await get(KEY)) as Partial<SavedState> | undefined;
    if (!raw || !raw.answers || typeof raw.answers !== "object") return null;
    return {
      answers: mergeAnswers(raw.answers),
      step: typeof raw.step === "number" ? raw.step : 0,
      savedAt: typeof raw.savedAt === "number" ? raw.savedAt : 0,
    };
  } catch (err) {
    console.warn("Restore failed", err);
    return null;
  }
}

export async function clearState(): Promise<void> {
  try {
    await del(KEY);
  } catch (err) {
    console.warn("Clear failed", err);
  }
}

/**
 * Lay saved answers over fresh defaults so a change to the answers shape
 * between versions never leaves a field undefined.
 */
function mergeAnswers(saved: Partial<Answers>): Answers {
  const base = defaultAnswers(saved.businessType ?? "other");
  return {
    ...base,
    ...saved,
    home: { ...base.home, ...(saved.home ?? {}) },
    about: { ...base.about, ...(saved.about ?? {}) },
    services: { ...base.services, ...(saved.services ?? {}) },
    gallery: { ...base.gallery, ...(saved.gallery ?? {}) },
    contact: { ...base.contact, ...(saved.contact ?? {}) },
    pages: Array.isArray(saved.pages) && saved.pages.length ? saved.pages : base.pages,
  };
}

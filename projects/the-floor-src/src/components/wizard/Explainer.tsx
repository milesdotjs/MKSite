/**
 * The "What's this?" popover. Keyboard accessible, Escape closes, focus goes
 * in on open and back to the trigger on close. Falls back to a plain link to
 * the glossary anchor for anyone who lands here without the panel.
 */

import { useEffect, useId, useRef, useState } from "react";
import { getGlossaryEntry } from "../../content/glossary";
import { wireframeSvg } from "../../lib/wireframe";
import { withBase } from "../../lib/base";

export function Explainer({ term }: { term: string }) {
  const entry = getGlossaryEntry(term);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!entry) return null;

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  const href = withBase(`glossary/#${entry.id}`);

  return (
    <span className="explainer">
      <button
        ref={triggerRef}
        type="button"
        className="explainer-trigger"
        aria-expanded={open}
        aria-controls={open ? `${id}-panel` : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        What's this?
      </button>
      {open && (
        <div ref={panelRef} id={`${id}-panel`} className="explainer-panel" role="dialog" aria-labelledby={`${id}-title`}>
          <button ref={closeRef} type="button" className="explainer-close" aria-label="Close" onClick={close}>
            &times;
          </button>
          <h4 id={`${id}-title`}>{entry.term}</h4>
          <p>{entry.definition}</p>
          {entry.where !== "none" && <div className="wireframe" dangerouslySetInnerHTML={{ __html: wireframeSvg(entry.where) }} />}
          {entry.tips && entry.tips.length > 0 && (
            <ul>
              {entry.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          {entry.developer && (
            <div className="explainer-dev">
              <strong>What a good developer does with this</strong>
              {entry.developer}
            </div>
          )}
          <p style={{ marginTop: "0.6rem", marginBottom: 0 }}>
            <a href={href} target="_blank" rel="noopener">
              More in the glossary
            </a>
          </p>
        </div>
      )}
    </span>
  );
}

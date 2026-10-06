/**
 * Live preview in a sandboxed iframe. The generated HTML is identical to the
 * download except for asset URLs; page links are intercepted here so
 * clicking "About" switches the preview instead of navigating the frame.
 *
 * Full screen takes over the viewport with one small floating control strip,
 * so the site looks the way it will in a browser tab: that's the moment the
 * download stops being abstract. Where the browser allows it, the overlay
 * also asks for real full screen; where it doesn't (iPhones), the overlay
 * alone does the job.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
import type { Answers } from "../../lib/generator";
import { buildPreviewSite } from "../../lib/preview";

type Device = "desktop" | "tablet" | "mobile";

const DEVICES: Array<{ id: Device; label: string }> = [
  { id: "desktop", label: "Desktop" },
  { id: "tablet", label: "Tablet" },
  { id: "mobile", label: "Phone" },
];

export function Preview({ answers }: { answers: Answers }) {
  const site = useMemo(() => buildPreviewSite(answers), [answers]);
  const [file, setFile] = useState(site.pages[0].file);
  const [device, setDevice] = useState<Device>("desktop");
  const [full, setFull] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // If the current page was removed, fall back to home.
  useEffect(() => {
    if (!site.pages.some((p) => p.file === file)) setFile(site.pages[0].file);
  }, [site, file]);

  const exitFull = useCallback(() => {
    setFull(false);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  }, []);

  useEffect(() => {
    if (!full) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") exitFull();
    };
    // If the browser leaves real full screen (its own Escape handling), leave ours too.
    const onChange = () => {
      if (!document.fullscreenElement) setFull(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onChange);
    wrapRef.current?.requestFullscreen?.().catch(() => {
      /* not allowed here; the overlay works on its own */
    });
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onChange);
    };
  }, [full, exitFull]);

  function onLoad(e: SyntheticEvent<HTMLIFrameElement>) {
    const doc = e.currentTarget.contentDocument;
    if (!doc) return;
    doc.addEventListener("click", (ev) => {
      const a = (ev.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.endsWith(".html")) {
        ev.preventDefault();
        setFile(href);
        frameRef.current?.contentWindow?.scrollTo(0, 0);
      } else if (!href.startsWith("#")) {
        // mailto:, tel:, and anything external don't belong in a preview.
        ev.preventDefault();
      }
    });
    // Escape should leave full screen even when the frame has focus.
    doc.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") exitFull();
    });
  }

  const html = site.files[file] ?? site.files[site.pages[0].file];

  return (
    <div ref={wrapRef} className={full ? "preview preview--full" : "preview"}>
      {full && (
        // On narrow screens the pill can't fit everything, and there's no Escape key.
        // This one is pinned top-right so leaving is never more than a tap away.
        <button type="button" className="preview-exit" onClick={exitFull}>
          Exit full screen
        </button>
      )}
      <div className="preview-bar">
        <div className="seg" role="group" aria-label="Page">
          {site.pages.map((p) => (
            <button key={p.id} type="button" aria-pressed={p.file === file} onClick={() => setFile(p.file)}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="seg" role="group" aria-label="Screen size">
          {DEVICES.map((d) => (
            <button key={d.id} type="button" aria-pressed={device === d.id} onClick={() => setDevice(d.id)}>
              {d.label}
            </button>
          ))}
        </div>
        <div className="seg preview-full-toggle" role="group" aria-label="View">
          <button type="button" aria-pressed={full} onClick={() => (full ? exitFull() : setFull(true))}>
            {full ? "Exit full screen" : "Full screen"}
          </button>
        </div>
      </div>
      <div className="preview-stage">
        <iframe
          ref={frameRef}
          className={`preview-frame preview-frame--${device}`}
          title="Preview of your site"
          // Scripts are allowed so the Pro motion runs in the preview. The frame
          // only ever holds HTML this tool generated: every user string is
          // escaped and the output has no inline handlers, so the only scripts
          // that can run are the two small ones the generator wrote.
          sandbox="allow-same-origin allow-scripts"
          srcDoc={html}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}

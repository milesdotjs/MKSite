/**
 * Live preview in a sandboxed iframe. The generated HTML is identical to the
 * download except for asset URLs; page links are intercepted here so
 * clicking "About" switches the preview instead of navigating the frame.
 */

import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";
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
  const frameRef = useRef<HTMLIFrameElement>(null);

  // If the current page was removed, fall back to home.
  useEffect(() => {
    if (!site.pages.some((p) => p.file === file)) setFile(site.pages[0].file);
  }, [site, file]);

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
  }

  const html = site.files[file] ?? site.files[site.pages[0].file];

  return (
    <div>
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
      </div>
      <div className="preview-stage">
        <iframe
          ref={frameRef}
          className={`preview-frame preview-frame--${device}`}
          title="Preview of your site"
          sandbox="allow-same-origin"
          srcDoc={html}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}

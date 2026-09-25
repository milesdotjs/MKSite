import { useMemo, useState } from "react";
import { generateSite } from "../../../lib/generator";
import { buildZip, downloadBlob } from "../../../lib/zip";
import { Explainer } from "../Explainer";
import type { StepProps } from "../types";

type Status = { kind: "idle" } | { kind: "building" } | { kind: "done"; filename: string; size: number } | { kind: "error"; message: string };

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DownloadStep({ answers, startOver }: StepProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const site = useMemo(() => generateSite(answers), [answers]);
  const files = [...Object.keys(site.files), ...site.images.map((i) => i.path), ...site.fonts.map((f) => f.path)].sort();

  async function download() {
    setStatus({ kind: "building" });
    try {
      const { blob, filename } = await buildZip(answers);
      downloadBlob(blob, filename);
      setStatus({ kind: "done", filename, size: blob.size });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }

  return (
    <>
      <h1>Download it</h1>
      <p className="lede">
        A ZIP of plain HTML, CSS and your pictures. The same thing a template site gives you. <Explainer term="static-site" />
      </p>

      <div className="download-box">
        <div className="btn-row">
          <button type="button" className="btn btn--tape btn--big" onClick={download} disabled={status.kind === "building"}>
            {status.kind === "building" ? "Building the ZIP" : "Download the ZIP"}
          </button>
          {status.kind === "done" && (
            <span>
              Saved <strong>{status.filename}</strong> ({formatSize(status.size)}).
            </span>
          )}
        </div>
        {status.kind === "error" && (
          <p style={{ color: "var(--danger)", marginTop: "0.75rem" }}>Couldn't build the ZIP: {status.message}. Try again, or try a different browser.</p>
        )}
        <ul className="file-list" aria-label="Files in the ZIP">
          {files.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <h2>Then what</h2>
      <p>
        Unzip it and double-click <code>index.html</code>. Every menu link works from the folder, no internet needed.
      </p>
      <p>
        To put it online for free, drag the unzipped folder onto <a href="https://app.netlify.com/drop" target="_blank" rel="noopener">Netlify Drop</a>.
        The README inside explains the rest. <Explainer term="hosting" />
      </p>
      <p>
        To change something, use the Back button. Your answers stay in this browser until you start over.
      </p>
      <div className="btn-row" style={{ marginTop: "2rem" }}>
        <button type="button" className="btn btn--ghost btn--danger" onClick={startOver}>
          Start over and erase my data
        </button>
      </div>
    </>
  );
}

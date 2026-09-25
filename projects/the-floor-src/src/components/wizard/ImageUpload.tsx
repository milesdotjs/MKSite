import type { ChangeEvent, ReactNode } from "react";
import type { ImageAsset } from "../../lib/generator";
import { assetFromFile, revokeUrl, urlFor } from "../../lib/objectUrls";

interface SingleProps {
  id: string;
  label: ReactNode;
  hint?: string;
  value: ImageAsset | null;
  onChange: (asset: ImageAsset | null) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ImageUpload({ id, label, hint, value, onChange }: SingleProps) {
  function pick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (value) revokeUrl(value.id);
    onChange(assetFromFile(file));
    e.target.value = "";
  }
  function remove() {
    if (value) revokeUrl(value.id);
    onChange(null);
  }

  return (
    <div className="field">
      <div className="field-label">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="upload">
        <div className="upload-drop">
          <span>{value ? "Choose a different picture" : "Choose a picture from your device"}</span>
          <input id={id} type="file" accept="image/*" onChange={pick} />
        </div>
        {value && (
          <div className="upload-preview">
            <img src={urlFor(value)} alt="" />
            <div className="small muted" style={{ marginTop: "0.4rem" }}>
              {value.name} ({formatSize(value.blob.size)})
            </div>
            <div className="btn-row">
              <button type="button" className="btn btn--quiet btn--danger" onClick={remove}>
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

interface MultiProps {
  id: string;
  label: ReactNode;
  hint?: string;
  images: ImageAsset[];
  max: number;
  onChange: (images: ImageAsset[]) => void;
}

export function MultiImageUpload({ id, label, hint, images, max, onChange }: MultiProps) {
  const room = Math.max(0, max - images.length);

  function pick(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, room);
    if (files.length) onChange([...images, ...files.map(assetFromFile)]);
    e.target.value = "";
  }
  function remove(idx: number) {
    const target = images[idx];
    if (target) revokeUrl(target.id);
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div className="field">
      <div className="field-label">
        <label htmlFor={id}>{label}</label>
        <span className="muted small">
          {images.length} of {max}
        </span>
      </div>
      <div className="upload-drop">
        <span>{room > 0 ? `Choose up to ${room} more` : "That's the maximum for this template"}</span>
        <input id={id} type="file" accept="image/*" multiple onChange={pick} disabled={room === 0} />
      </div>
      {images.length > 0 && (
        <ul className="thumbs">
          {images.map((img, i) => (
            <li key={img.id} className="thumb">
              <img src={urlFor(img)} alt={`Gallery picture ${i + 1}`} />
              <button type="button" aria-label={`Remove picture ${i + 1}`} onClick={() => remove(i)}>
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

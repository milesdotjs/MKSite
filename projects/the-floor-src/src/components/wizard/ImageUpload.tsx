import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import type { ImageAsset } from "../../lib/generator";
import { assetFromFile, revokeUrl, urlFor } from "../../lib/objectUrls";

/** What the template will do with the picture, so we can warn about the wrong shape. */
export type ImageShape = "landscape" | "wide";

interface SingleProps {
  id: string;
  label: ReactNode;
  hint?: string;
  shape?: ImageShape;
  value: ImageAsset | null;
  onChange: (asset: ImageAsset | null) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Reads the pixel size of an uploaded image, for shape warnings. */
function useImageSize(asset: ImageAsset | null): { w: number; h: number } | null {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    setSize(null);
    if (!asset) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = urlFor(asset);
    return () => {
      cancelled = true;
    };
  }, [asset]);
  return size;
}

function shapeWarning(shape: ImageShape | undefined, size: { w: number; h: number } | null): string | null {
  if (!shape || !size) return null;
  if (shape === "landscape") {
    if (size.h > size.w) {
      return "This photo is taller than it is wide. The site will crop the top and bottom off to fit the space. A landscape photo works better here.";
    }
    if (size.w < 1200) {
      return `This photo is only ${size.w} pixels across, so it may look soft on a big screen. Bigger is better for the top of the page.`;
    }
  }
  if (shape === "wide" && size.h >= size.w) {
    return "This logo is as tall as it is wide, so it will show quite small in the header. A wide version, if you have one, fits better.";
  }
  return null;
}

export function ImageUpload({ id, label, hint, shape, value, onChange }: SingleProps) {
  const size = useImageSize(value);
  const warning = shapeWarning(shape, size);

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
        <label className="upload-drop" htmlFor={id}>
          <span>{value ? "Choose a different picture" : "Tap or click here to choose a picture from your device"}</span>
          <input id={id} type="file" accept="image/*" onChange={pick} />
        </label>
        {value && (
          <div className="upload-preview">
            <img src={urlFor(value)} alt="" />
            <div className="small muted" style={{ marginTop: "0.4rem" }}>
              {value.name} ({formatSize(value.blob.size)}
              {size ? `, ${size.w} × ${size.h}` : ""})
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
      {warning && (
        <div className="notice notice--tape" role="status" style={{ marginTop: "0.75rem" }}>
          <p>{warning}</p>
        </div>
      )}
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
      <label className="upload-drop" htmlFor={id}>
        <span>{room > 0 ? `Tap or click here to choose up to ${room} more` : "That's the maximum for this template"}</span>
        <input id={id} type="file" accept="image/*" multiple onChange={pick} disabled={room === 0} />
      </label>
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

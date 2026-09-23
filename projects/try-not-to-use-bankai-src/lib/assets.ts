import manifest from "./sprites.json";

export type Frame = { src: string; w: number; h: number; ox: number; oy: number };
type Manifest = Record<string, Frame[] | { src: string; w: number; h: number }>;

const M = manifest as unknown as Manifest;

// Baked in by next.config.ts so the static export works from its sub-folder.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => `${BASE_PATH}/${p.replace(/^\//, "")}`;

export function seq(name: string): Frame[] {
  const s = M[name];
  if (!Array.isArray(s)) throw new Error(`Unknown sprite sequence: ${name}`);
  return s;
}

export function single(name: string): Frame {
  return seq(name)[0];
}

// The Dark Souls stage is 512x384; every sprite offset is in that pixel space.
export const STAGE_W = 512;
export const STAGE_H = 384;
export const STAGE_SRC = (M["_stage"] as { src: string }).src;

let preloaded: Promise<void> | null = null;
export function preloadAll(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (preloaded) return preloaded;
  const all = Object.values(M).flatMap((v) => (Array.isArray(v) ? v : [v]));
  preloaded = Promise.all(
    all.map(
      (f) =>
        new Promise<void>((res) => {
          const im = new Image();
          im.onload = () => res();
          im.onerror = () => res();
          im.src = asset(f.src);
        }),
    ),
  ).then(() => undefined);
  return preloaded;
}

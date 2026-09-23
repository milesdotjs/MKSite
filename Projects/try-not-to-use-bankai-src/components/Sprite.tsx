"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { asset, seq } from "@/lib/assets";

export type SpriteProps = {
  /** Sequence name from lib/sprites.json */
  name: string;
  /** Frames per second (default 8) */
  fps?: number;
  /** Loop (default true). Non-looping sprites hold their last frame. */
  loop?: boolean;
  /** Optional explicit frame order (indices into the sequence) */
  order?: number[];
  /** CSS px per native sprite px */
  scale: number;
  /** Mirror horizontally */
  flip?: boolean;
  /** Fired once when a non-looping sequence reaches its end */
  onEnd?: () => void;
  /** Change this to restart the sequence from frame 0 */
  playKey?: string | number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders one frame of a sprite sequence, anchored bottom-centre at the
 * parent's origin. The manifest's ox/oy keep frames of different sizes
 * aligned to the same feet position.
 */
export default function Sprite({ name, fps = 8, loop = true, order, scale, flip, onEnd, playKey, className, style }: SpriteProps) {
  const frames = useMemo(() => {
    const s = seq(name);
    // negative indices count from the end, so [-1] means "hold the last frame"
    return order ? order.map((i) => s[i < 0 ? s.length + i : i]) : s;
  }, [name, order]);
  const [i, setI] = useState(0);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    setI(0);
    let idx = 0;
    if (frames.length <= 1) {
      if (!loop) {
        const t = setTimeout(() => onEndRef.current?.(), 1000 / fps);
        return () => clearTimeout(t);
      }
      return;
    }
    const id = setInterval(() => {
      idx++;
      if (idx >= frames.length) {
        if (loop) {
          idx = 0;
        } else {
          clearInterval(id);
          onEndRef.current?.();
          return;
        }
      }
      setI(idx);
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [frames, fps, loop, playKey]);

  const f = frames[Math.min(i, frames.length - 1)];
  const tx = (flip ? -f.ox : f.ox) * scale;
  const ty = -f.oy * scale;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(f.src)}
      alt=""
      draggable={false}
      className={`sprite ${className ?? ""}`}
      style={{
        width: f.w * scale,
        height: f.h * scale,
        transform: `translate(calc(-50% + ${tx}px), ${ty}px)${flip ? " scaleX(-1)" : ""}`,
        ...style,
      }}
    />
  );
}

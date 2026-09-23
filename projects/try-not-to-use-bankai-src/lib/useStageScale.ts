"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

/**
 * CSS px per native sprite px for a stage element. Byakuya's idle frame is
 * 99 native px tall; dividing the stage height by ~205 makes him roughly
 * half the stage, which is how the DS game framed its fighters. The width
 * divisor stops sprites outgrowing a narrow (portrait) stage.
 */
export function useStageScale(ref: RefObject<HTMLElement | null>, hDiv = 205, wDiv = 150) {
  const [scale, setScale] = useState(2);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.height > 0 && r.width > 0) setScale(Math.max(1, Math.min(r.height / hDiv, r.width / wDiv)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, hDiv, wDiv]);
  return scale;
}

"use client";

import { useEffect, useState } from "react";
import type { AnimKey, HostDef } from "@/lib/hosts";
import Sprite from "./Sprite";

export type HostAnim = "idle" | "ack" | "strike" | "hidden";

type Props = {
  host: HostDef;
  anim: HostAnim;
  /** true once the player has made a mistake: hosts with an idle2 switch to it */
  struck: boolean;
  scale: number;
  flip?: boolean;
  playKey?: number;
};

/**
 * Plays the host's idle / acknowledge / strike animations. After a strike a
 * host either holds the strike pose (Byakuya's raised sword, Pain's palm) or,
 * if it defines idle2, settles into that (Piccolo with the cape off).
 */
export default function HostSprite({ host, anim, struck, scale, flip, playKey }: Props) {
  const [cur, setCur] = useState<AnimKey | "hidden">("idle");
  const [tick, setTick] = useState(0);
  const hasIdle2 = Boolean(host.anims.idle2);

  useEffect(() => {
    let next: AnimKey | "hidden";
    if (anim === "hidden") next = "hidden";
    else if (anim === "idle") next = struck && hasIdle2 ? "idle2" : "idle";
    else if (anim === "ack") next = struck && !hasIdle2 ? "strike" : "ack";
    else next = "strike";
    setCur(next);
    setTick((t) => t + 1);
  }, [anim, struck, hasIdle2, playKey, host.id]);

  if (cur === "hidden") return null;
  const d = host.anims[cur] ?? host.anims.idle;
  // A host without idle2 re-showing "strike" as its resting pose just holds the last frame.
  const holdLast = cur === "strike" && anim !== "strike" && !d.loop;
  return (
    <Sprite
      name={d.seq}
      fps={d.fps}
      loop={d.loop}
      order={holdLast ? [-1] : undefined}
      scale={scale}
      flip={flip}
      playKey={`${host.id}-${cur}-${tick}`}
      onEnd={() => {
        if (d.then) {
          const t = d.then === "idle" && struck && hasIdle2 ? "idle2" : d.then;
          setCur(t);
          setTick((k) => k + 1);
        }
      }}
    />
  );
}

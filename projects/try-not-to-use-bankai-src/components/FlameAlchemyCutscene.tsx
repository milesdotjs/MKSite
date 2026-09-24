"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsapSetup";
import { asset, seq } from "@/lib/assets";
import { FlameFx } from "@/lib/fx2";
import { audio } from "@/lib/audio";
import Sprite from "./Sprite";
import { useStageScale } from "@/lib/useStageScale";

type Props = { onDone: () => void };

const EYES = seq("mus_eyes");

/**
 * ~8 second Flame Alchemy.
 *   0.0  cut-in: the eyes open, strip by strip, "FLAME ALCHEMY"
 *   1.5  stage: hand up, the glove's circle flashes
 *   2.4  snap: one spark, a beat of silence
 *   2.7  ignition: a ring of fire, then the whole plaza goes up
 *   4.6  the kanji, the title letters, the sea of fire climbs the screen
 *   7.0  white-orange wash, cut
 */
export default function FlameAlchemyCutscene({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scale = useStageScale(stage, 230, 160);
  const [pose, setPose] = useState<"idle" | "gloves" | "snap" | "blast">("idle");
  const [eye, setEye] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const fx = new FlameFx(canvas.current!);
    fx.origin = { x: 0.5, y: 0.78 };
    fx.start();
    audio.flameAlchemy();

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    // --- cut-in: eyes opening
    tl.set(q(".fa-cutin"), { display: "flex" }, 0)
      .fromTo(q(".fa-strip"), { xPercent: 120 }, { xPercent: 0, duration: 0.22, ease: "power4.out" }, 0.05)
      .fromTo(q(".fa-cutin__lines"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.05)
      .call(() => setEye(1), [], 0.45)
      .call(() => setEye(2), [], 0.7)
      .call(() => setEye(3), [], 0.95)
      .fromTo(q(".fa-word"), { scale: 3.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "power4.in" }, 0.98)
      .fromTo(q(".fa-flash"), { opacity: 1 }, { opacity: 0, duration: 0.35, immediateRender: false }, 1.16)
      .to(q(".fa-cutin"), { opacity: 0, duration: 0.15 }, 1.45)
      .set(q(".fa-cutin"), { display: "none" }, 1.6);

    // --- hand up, glove flashes
    tl.call(() => setPose("gloves"), [], 1.6)
      .to(q(".fa-stagebg"), { "--dark": 0.5, duration: 0.8 } as gsap.TweenVars, 1.6);

    // --- snap
    tl.call(() => setPose("snap"), [], 2.4)
      .fromTo(q(".fa-flash"), { opacity: 0.85 }, { opacity: 0, duration: 0.25, immediateRender: false }, 2.55)
      .call(() => { fx.burst(1); fx.shake = 6; }, [], 2.7)
      .to(fx, { intensity: 0.55, duration: 1.0, ease: "power2.in" }, 2.8)
      .call(() => setPose("blast"), [], 2.9)
      .fromTo(q(".fa-glow"), { opacity: 0 }, { opacity: 0.85, duration: 0.5 }, 2.9)
      .to(q(".fa-stage"), { x: 4, duration: 0.05, yoyo: true, repeat: 30, ease: "none" }, 2.9)
      .call(() => fx.burst(1.4), [], 3.6)
      .call(() => fx.burst(1.2), [], 4.2);

    // --- the plaza burns
    tl.fromTo(q(".fa-kanji"), { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.4 }, 4.2)
      .to(fx, { intensity: 1, sea: 0.55, duration: 2.2, ease: "power1.in" }, 4.4)
      .call(() => { fx.shake = 12; }, [], 4.6)
      .fromTo(q(".fa-title .word span"), { opacity: 0, y: 30, scale: 1.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, stagger: 0.05, ease: "power3.out" }, 4.8)
      .to(q(".fa-stage"), { x: -8, duration: 0.04, yoyo: true, repeat: 60, ease: "none" }, 4.6)
      .to(q(".fa-title"), { opacity: 0, duration: 0.3 }, 7.0);

    // --- wash out
    tl.to(fx, { sea: 1, duration: 1.2, ease: "power2.in" }, 6.6)
      .fromTo(q(".fa-wash"), { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.in", immediateRender: false }, 7.0)
      .to(q(".fa-wash"), { backgroundColor: "#000", duration: 0.2 }, 8.0)
      .call(() => { fx.stop(); doneRef.current(); }, [], 8.25);

    return () => { tl.kill(); fx.stop(); };
  }, []);

  const strip = EYES[Math.min(eye, EYES.length - 1)];

  return (
    <div className="bankai fa" ref={root}>
      <div className="bk-stage fa-stage" ref={stage}>
        <div className="fa-stagebg" style={{ backgroundImage: `url(${asset("bg/central_hq.png")})` }} />
        <div className="fa-glow" />
        <div className="bk-figure fa-figure">
          {pose === "idle" && <Sprite name="mus_idle" fps={6} scale={scale} />}
          {pose === "gloves" && <Sprite name="mus_gloves" fps={6} loop={false} scale={scale} />}
          {pose === "snap" && <Sprite name="mus_snap" fps={10} loop={false} scale={scale} />}
          {pose === "blast" && <Sprite name="mus_blast" fps={8} scale={scale} order={[0, 1, 2, 3, 1, 2]} />}
        </div>
        <div className="kanji fa-kanji">焔の錬金術師</div>
      </div>
      <canvas ref={canvas} className="bk-canvas" />
      <div className="bk-title fa-title">
        {["FLAME", "ALCHEMY"].map((word, wi) => (
          <span key={wi} className="word">{word.split("").map((ch, i) => <span key={i}>{ch}</span>)}</span>
        ))}
      </div>
      <div className="bk-cutin fa-cutin">
        <div className="bk-cutin__lines fa-cutin__lines" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="fa-strip" src={asset(strip.src)} alt="" draggable={false} />
        <div className="bk-word fa-word">FLAME<br />ALCHEMY</div>
      </div>
      <div className="bk-flash fa-flash" />
      <div className="bk-wash fa-wash" />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsapSetup";
import { asset, single } from "@/lib/assets";
import { BeamFx } from "@/lib/fx";
import { audio } from "@/lib/audio";
import Sprite from "./Sprite";
import { useStageScale } from "@/lib/useStageScale";

type Props = { onDone: () => void };

/**
 * ~8 second Special Beam Cannon.
 *   0.0  cut-in: Piccolo's face, "SPECIAL BEAM CANNON"
 *   1.5  cape already off; two fingers to the forehead
 *   1.8  charge: sparks gather, the whine climbs, the screen shakes
 *   4.6  fire: the beam drills across and out through the screen
 *   5.0  the screen cracks, title letters, the kanji
 *   6.5  white out, cut
 */
export default function SpecialBeamCutscene({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scale = useStageScale(stage, 230, 160);
  const [pose, setPose] = useState<"idle" | "charge" | "fire">("idle");
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const fx = new BeamFx(canvas.current!);
    fx.start();
    audio.specialBeam();

    // fingertip: the figure stands at 44% x with his feet at 9% from the bottom;
    // the charge frame's fingers sit up by the forehead.
    const setTip = () => {
      const r = stage.current!.getBoundingClientRect();
      const fig = 99 * scale * 0.7; // rough sprite height in px
      fx.tip = { x: 0.44 + (18 * scale) / r.width, y: (r.height * 0.91 - fig * 0.92) / r.height };
    };

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    // --- cut-in
    tl.set(q(".sb-cutin"), { display: "flex" }, 0)
      .fromTo(q(".sb-cutin__art"), { xPercent: 130 }, { xPercent: 0, duration: 0.22, ease: "power4.out" }, 0.05)
      .fromTo(q(".sb-cutin__lines"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.05)
      .fromTo(q(".sb-word"), { scale: 3.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "power4.in" }, 0.32)
      .fromTo(q(".sb-flash"), { opacity: 1 }, { opacity: 0, duration: 0.35, immediateRender: false }, 0.5)
      .to(q(".sb-cutin"), { opacity: 0, duration: 0.15 }, 1.3)
      .set(q(".sb-cutin"), { display: "none" }, 1.45);

    // --- charge
    tl.call(() => { setPose("charge"); setTip(); }, [], 1.5)
      .to(fx, { charge: 1, duration: 2.8, ease: "power2.in" }, 1.8)
      .to(q(".sb-stage"), { x: 2, duration: 0.05, yoyo: true, repeat: 55, ease: "none" }, 1.8)
      .to(q(".sb-stagebg"), { "--dark": 0.55, duration: 2.5 } as gsap.TweenVars, 1.8)
      .fromTo(q(".sb-glow"), { opacity: 0 }, { opacity: 0.75, duration: 2.6 }, 1.8)
      .fromTo(q(".sb-kanji"), { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.4 }, 3.4);

    // --- fire
    tl.call(() => { setPose("fire"); fx.fire(); fx.shake = 16; }, [], 4.6)
      .fromTo(q(".sb-flash"), { opacity: 1 }, { opacity: 0, duration: 0.45, immediateRender: false }, 4.62)
      .to(q(".sb-stage"), { x: -10, duration: 0.04, yoyo: true, repeat: 60, ease: "none" }, 4.6)
      .to(q(".sb-stagebg"), { "--dark": 0.8, duration: 0.4 } as gsap.TweenVars, 4.6)
      .call(() => fx.crack(0.6), [], 5.0)
      .call(() => fx.crack(1), [], 5.4)
      .fromTo(q(".sb-title .word span"), { opacity: 0, y: 30, scale: 1.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, stagger: 0.045, ease: "power3.out" }, 5.1)
      .to(q(".sb-title"), { opacity: 0, duration: 0.3 }, 7.0);

    // --- white out
    tl.fromTo(q(".sb-wash"), { opacity: 0 }, { opacity: 1, duration: 1.0, ease: "power2.in", immediateRender: false }, 6.5)
      .to(q(".sb-wash"), { backgroundColor: "#000", duration: 0.2 }, 7.7)
      .call(() => { fx.stop(); doneRef.current(); }, [], 7.95);

    return () => { tl.kill(); fx.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const art = single("pic_face");

  return (
    <div className="bankai sb" ref={root}>
      <div className="bk-stage sb-stage" ref={stage}>
        <div className="sb-stagebg" style={{ backgroundImage: `url(${asset("bg/canyon.png")})` }} />
        <div className="sb-glow" />
        <div className="bk-figure sb-figure">
          {pose === "idle" && <Sprite name="pic_idle" fps={6} scale={scale} />}
          {pose === "charge" && <Sprite name="pic_charge" fps={3} scale={scale} />}
          {pose === "fire" && <Sprite name="pic_fire" fps={12} loop={false} scale={scale} order={[0, 1, 2, 3, 2, 3, 2, 3]} />}
        </div>
        <div className="kanji sb-kanji">魔貫光殺砲</div>
      </div>
      <canvas ref={canvas} className="bk-canvas" />
      <div className="bk-title sb-title">
        {["SPECIAL", "BEAM", "CANNON"].map((word, wi) => (
          <span key={wi} className="word">{word.split("").map((ch, i) => <span key={i}>{ch}</span>)}</span>
        ))}
      </div>
      <div className="bk-cutin sb-cutin">
        <div className="bk-cutin__lines sb-cutin__lines" />
        <div className="bk-word sb-word">SPECIAL<br />BEAM<br />CANNON</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bk-cutin__art sb-cutin__art" src={asset(art.src)} alt="" draggable={false} />
      </div>
      <div className="bk-flash sb-flash" />
      <div className="bk-wash sb-wash" />
    </div>
  );
}

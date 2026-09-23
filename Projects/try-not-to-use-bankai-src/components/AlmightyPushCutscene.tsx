"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsapSetup";
import { asset, single } from "@/lib/assets";
import { Shockwave } from "@/lib/fx";
import { audio } from "@/lib/audio";
import Sprite from "./Sprite";
import { useStageScale } from "@/lib/useStageScale";

type Props = { onDone: () => void };

/**
 * ~8 second Almighty Push.
 *   0.0  cut-in: the Six Paths, "ALMIGHTY PUSH"
 *   1.5  Pain's palm: a first shockwave, rocks jump
 *   2.4  he rises, arms up, the sky goes dark
 *   3.2  the big push: rings, the whole stage shoved away, debris torn up
 *   4.8  title letters, the kanji
 *   7.0  wash out, cut
 */
export default function AlmightyPushCutscene({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scale = useStageScale(stage, 230, 160);
  const [pose, setPose] = useState<"idle" | "push" | "up">("idle");
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const fx = new Shockwave(canvas.current!);
    fx.origin = { x: 0.5, y: 0.62 };
    fx.start();
    audio.almightyPush();

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    // --- cut-in
    tl.set(q(".ap-cutin"), { display: "flex" }, 0)
      .fromTo(q(".ap-cutin__art"), { xPercent: 130 }, { xPercent: 0, duration: 0.22, ease: "power4.out" }, 0.05)
      .fromTo(q(".ap-cutin__lines"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.05)
      .fromTo(q(".ap-word"), { scale: 3.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "power4.in" }, 0.32)
      .fromTo(q(".ap-flash"), { opacity: 1 }, { opacity: 0, duration: 0.35, immediateRender: false }, 0.5)
      .to(q(".ap-cutin"), { opacity: 0, duration: 0.15 }, 1.3)
      .set(q(".ap-cutin"), { display: "none" }, 1.45);

    // --- first push
    tl.call(() => setPose("push"), [], 1.5)
      .call(() => { fx.ring(0.7); fx.burst(40); fx.shake = 6; }, [], 1.65)
      .to(q(".ap-stage"), { x: 5, duration: 0.04, yoyo: true, repeat: 9, ease: "none" }, 1.65)
      .call(() => { fx.shake = 0; }, [], 2.2);

    // --- he rises
    tl.call(() => setPose("up"), [], 2.4)
      .to(q(".ap-figure"), { y: () => -stage.current!.getBoundingClientRect().height * 0.22, duration: 1.0, ease: "power2.inOut" }, 2.4)
      .to(q(".ap-stagebg"), { "--dark": 0.6, duration: 0.9 } as gsap.TweenVars, 2.5)
      .fromTo(q(".ap-glow"), { opacity: 0 }, { opacity: 0.8, duration: 0.7 }, 2.6);

    // --- the big one
    tl.call(() => { fx.ring(1.4); fx.gravity = 2600; fx.debrisRate = 90; fx.shake = 14; fx.burst(80); }, [], 3.2)
      .call(() => fx.ring(1.2), [], 3.45)
      .call(() => fx.ring(1.0), [], 3.7)
      .call(() => fx.ring(1.1), [], 4.1)
      .call(() => fx.ring(1.0), [], 4.6)
      .fromTo(q(".ap-flash"), { opacity: 0.9 }, { opacity: 0, duration: 0.4, immediateRender: false }, 3.2)
      .to(q(".ap-stagebg"), { scale: 1.45, duration: 3.6, ease: "power1.in" }, 3.2)
      .to(q(".ap-stage"), { x: -9, duration: 0.04, yoyo: true, repeat: 70, ease: "none" }, 3.2)
      .fromTo(q(".ap-kanji"), { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.4 }, 3.6)
      .fromTo(q(".ap-title .word span"), { opacity: 0, y: 30, scale: 1.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, stagger: 0.05, ease: "power3.out" }, 4.8)
      .call(() => { fx.debrisRate = 160; fx.shake = 20; }, [], 5.6)
      .call(() => fx.ring(1.3), [], 5.8)
      .call(() => fx.ring(1.3), [], 6.3)
      .to(q(".ap-title"), { opacity: 0, duration: 0.3 }, 7.2);

    // --- wash out
    tl.fromTo(q(".ap-wash"), { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.in", immediateRender: false }, 7.0)
      .to(q(".ap-wash"), { backgroundColor: "#000", duration: 0.2 }, 8.05)
      .call(() => { fx.stop(); doneRef.current(); }, [], 8.3);

    return () => { tl.kill(); fx.stop(); };
  }, []);

  const art = single("pain_group");

  return (
    <div className="bankai ap" ref={root}>
      <div className="bk-stage ap-stage" ref={stage}>
        <div className="ap-stagebg" style={{ backgroundImage: `url(${asset("bg/rocky.png")})` }} />
        <div className="ap-glow" />
        <div className="bk-figure ap-figure">
          {pose === "idle" && <Sprite name="pain_idle" fps={7} scale={scale} />}
          {pose === "push" && <Sprite name="pain_push" fps={6} loop={false} scale={scale} />}
          {pose === "up" && <Sprite name="pain_armsup" fps={3} scale={scale} />}
        </div>
        <div className="kanji ap-kanji">神羅天征</div>
      </div>
      <canvas ref={canvas} className="bk-canvas" />
      <div className="bk-title ap-title">
        {["ALMIGHTY", "PUSH"].map((word, wi) => (
          <span key={wi} className="word">{word.split("").map((ch, i) => <span key={i}>{ch}</span>)}</span>
        ))}
      </div>
      <div className="bk-cutin ap-cutin">
        <div className="bk-cutin__lines ap-cutin__lines" />
        <div className="bk-word ap-word">ALMIGHTY<br />PUSH</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bk-cutin__art ap-cutin__art" src={asset(art.src)} alt="" draggable={false} />
      </div>
      <div className="bk-flash ap-flash" />
      <div className="bk-wash ap-wash" />
    </div>
  );
}

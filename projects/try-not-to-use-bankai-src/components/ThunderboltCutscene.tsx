"use client";

import { useEffect, useRef } from "react";
import gsap from "@/lib/gsapSetup";
import { asset, single } from "@/lib/assets";
import { BoltFx } from "@/lib/fx2";
import { audio } from "@/lib/audio";
import Sprite from "./Sprite";
import { useStageScale } from "@/lib/useStageScale";

type Props = { onDone: () => void };

/**
 * ~8 second Thunderbolt.
 *   0.0  cut-in: Pikachu, huge, "THUNDERBOLT"
 *   1.5  stage: the cheeks spark, a hum climbs, the sky goes yellow
 *   3.0  first bolt straight into Pikachu, white flash
 *   3.6+ bolts everywhere, the kanji (100,000 volts), the title
 *   6.8  white out. You blacked out.
 */
export default function ThunderboltCutscene({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scale = useStageScale(stage, 230, 160) * 1.7;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const fx = new BoltFx(canvas.current!);
    fx.start();
    audio.thunderbolt();
    const setCheeks = () => {
      // Pikachu stands at 50% x with feet at 9% from the bottom; cheeks sit ~32 native px up, ±15 px out
      const r = stage.current!.getBoundingClientRect();
      const feetY = r.height * 0.91;
      fx.cheeks = [
        { x: 0.5 - (15 * scale) / r.width, y: (feetY - 32 * scale) / r.height },
        { x: 0.5 + (16 * scale) / r.width, y: (feetY - 32 * scale) / r.height },
      ];
    };

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    // --- cut-in
    tl.set(q(".tb-cutin"), { display: "flex" }, 0)
      .fromTo(q(".tb-cutin__art"), { xPercent: 130 }, { xPercent: 0, duration: 0.22, ease: "power4.out" }, 0.05)
      .fromTo(q(".tb-cutin__lines"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.05)
      .fromTo(q(".tb-word"), { scale: 3.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "power4.in" }, 0.32)
      .fromTo(q(".tb-flash"), { opacity: 1 }, { opacity: 0, duration: 0.35, immediateRender: false }, 0.5)
      .to(q(".tb-cutin"), { opacity: 0, duration: 0.15 }, 1.3)
      .set(q(".tb-cutin"), { display: "none" }, 1.45);

    // --- charge
    tl.call(setCheeks, [], 1.5)
      .to(fx, { charge: 1, duration: 1.4, ease: "power2.in" }, 1.5)
      .to(q(".tb-stagebg"), { "--dark": 0.55, duration: 1.4 } as gsap.TweenVars, 1.5)
      .to(fx, { tint: 0.25, duration: 1.4 }, 1.5)
      .to(q(".tb-stage"), { x: 2, duration: 0.05, yoyo: true, repeat: 28, ease: "none" }, 1.6);

    // --- bolts
    const bolt = (t: number, big: boolean) => {
      tl.call(() => { fx.strike(0.5, 0.75, big ? 9 : 6, big ? 2.2 : 1.2); if (big) fx.storm(3); fx.shake = big ? 16 : 8; }, [], t)
        .fromTo(q(".tb-flash"), { opacity: big ? 1 : 0.8 }, { opacity: 0, duration: big ? 0.35 : 0.2, immediateRender: false }, t);
    };
    bolt(3.0, true);
    bolt(3.7, false);
    bolt(4.1, false);
    bolt(4.6, true);
    bolt(5.2, false);
    bolt(5.5, true);
    bolt(6.0, true);
    bolt(6.4, true);
    tl.to(fx, { tint: 0.7, duration: 3.2 }, 3.0)
      .to(q(".tb-stage"), { x: -9, duration: 0.04, yoyo: true, repeat: 80, ease: "none" }, 3.0)
      .fromTo(q(".tb-kanji"), { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.4 }, 3.4)
      .fromTo(q(".tb-title .word span"), { opacity: 0, y: 30, scale: 1.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, stagger: 0.06, ease: "power3.out" }, 4.7)
      .call(() => { fx.charge = 0; }, [], 6.0)
      .to(q(".tb-title"), { opacity: 0, duration: 0.3 }, 6.9);

    // --- you blacked out
    tl.call(() => fx.storm(8), [], 6.8)
      .fromTo(q(".tb-wash"), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.in", immediateRender: false }, 6.8)
      .to(q(".tb-wash"), { backgroundColor: "#000", duration: 0.25 }, 7.6)
      .call(() => { fx.stop(); doneRef.current(); }, [], 8.0);

    return () => { tl.kill(); fx.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const art = single("pika_idle");

  return (
    <div className="bankai tb" ref={root}>
      <div className="bk-stage tb-stage" ref={stage}>
        <div className="tb-stagebg" style={{ backgroundImage: `url(${asset("bg/meadow.png")})` }} />
        <div className="bk-figure tb-figure">
          <Sprite name="pika_idle" fps={14} scale={scale} />
        </div>
        <div className="kanji tb-kanji">十万ボルト</div>
      </div>
      <canvas ref={canvas} className="bk-canvas" />
      <div className="bk-title tb-title">
        <span className="word">{"THUNDERBOLT".split("").map((ch, i) => <span key={i}>{ch}</span>)}</span>
      </div>
      <div className="bk-cutin tb-cutin">
        <div className="bk-cutin__lines tb-cutin__lines" />
        <div className="bk-word tb-word">THUNDER<br />BOLT</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bk-cutin__art tb-cutin__art" src={asset(art.src)} alt="" draggable={false} />
      </div>
      <div className="bk-flash tb-flash" />
      <div className="bk-wash tb-wash" />
    </div>
  );
}

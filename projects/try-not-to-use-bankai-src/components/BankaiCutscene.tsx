"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsapSetup";
import { asset, seq, single, STAGE_SRC } from "@/lib/assets";
import { PetalStorm } from "@/lib/petals";
import { audio } from "@/lib/audio";
import Sprite from "./Sprite";
import { useStageScale } from "@/lib/useStageScale";

type Props = { onDone: () => void };

const KANJI = seq("kanji"); // 千本 桜 景 厳
const BLADES = seq("blades");

/**
 * ~8 second Bankai. Runs as a full-screen overlay with its own little stage so
 * the timeline owns every element:
 *   0.0  cut-in slams in, "BANKAI"
 *   1.4  back on the stage: arms spread, the sword falls into the ground
 *   2.8  reiatsu burst, stage goes black
 *   3.1  thousand blades rise on both sides, the kanji descend
 *   4.7  blades shatter into a petal storm, title text
 *   7.0  petals converge, wash-out, cut
 */
export default function BankaiCutscene({ onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scale = useStageScale(stage, 230, 160);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [byk, setByk] = useState<"stand" | "bankai" | "spread">("stand");
  const [sword, setSword] = useState(false);
  const [wings, setWings] = useState(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const storm = new PetalStorm(canvas.current!);
    storm.mode = "storm";
    storm.target = 0;
    storm.wind = 1;
    storm.start();
    audio.bankai();

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    // --- cut-in
    tl.set(q(".bk-cutin"), { display: "flex" }, 0)
      .fromTo(q(".bk-cutin__art"), { xPercent: 130 }, { xPercent: 0, duration: 0.22, ease: "power4.out" }, 0.05)
      .fromTo(q(".bk-cutin__lines"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.05)
      .fromTo(q(".bk-word"), { scale: 3.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "power4.in" }, 0.32)
      .fromTo(q(".bk-flash"), { opacity: 1 }, { opacity: 0, duration: 0.35, immediateRender: false }, 0.5)
      .to(q(".bk-cutin"), { opacity: 0, duration: 0.15 }, 1.3)
      .set(q(".bk-cutin"), { display: "none" }, 1.45);

    // --- stage: arms spread, sword sinks
    tl.call(() => setByk("bankai"), [], 1.45)
      .call(() => setSword(true), [], 2.05)
      .fromTo(q(".bk-vortex"), { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.5 }, 2.15)
      .to(q(".bk-vortex"), { opacity: 0.55, duration: 0.6 }, 2.7)
      .call(() => setByk("spread"), [], 2.4)
      // reiatsu burst behind him, stage goes black
      .call(() => setWings(true), [], 2.75)
      .to(q(".bk-stagebg"), { opacity: 0, duration: 0.6 }, 2.8)
      .fromTo(q(".bk-glow"), { opacity: 0 }, { opacity: 0.9, duration: 0.3 }, 2.8)
      .to(q(".bk-glow"), { opacity: 0.35, duration: 1.2 }, 3.2)
      .call(() => setWings(false), [], 3.9);

    // --- thousand blades
    tl.fromTo(q(".bk-blades--l"), { yPercent: 100 }, { yPercent: 0, duration: 1.1, ease: "power3.out" }, 3.1)
      .fromTo(q(".bk-blades--r"), { yPercent: 100 }, { yPercent: 0, duration: 1.1, ease: "power3.out" }, 3.25)
      .fromTo(q(".bk-white"), { yPercent: 110, opacity: 0.9 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: "power3.out" }, 3.2)
      .fromTo(q(".bk-kanji"), { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.28 }, 3.3)
      .to(q(".bk-stage"), { x: 4, duration: 0.05, yoyo: true, repeat: 15, ease: "none" }, 3.1)
      .call(() => { storm.target = 250; storm.wind = 0.5; }, [], 3.6);

    // --- shatter into petals
    tl.call(() => { storm.target = 1800; storm.wind = 1; storm.shake = 8; }, [], 4.7)
      .to(q(".bk-stage"), { x: -7, duration: 0.04, yoyo: true, repeat: 40, ease: "none" }, 4.7)
      .fromTo(q(".bk-flash"), { opacity: 0.9 }, { opacity: 0, duration: 0.3, immediateRender: false }, 4.7)
      .to(q(".bk-blades, .bk-white, .bk-kanji, .bk-vortex, .bk-glow"), { opacity: 0, duration: 0.25 }, 4.75)
      .to(q(".bk-stagefigs"), { opacity: 0, duration: 0.5 }, 5.0)
      .fromTo(q(".bk-title .word span"), { opacity: 0, y: 30, scale: 1.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, stagger: 0.045, ease: "power3.out" }, 5.2)
      .to(q(".bk-title"), { opacity: 0, duration: 0.3 }, 7.2);

    // --- converge and wash out
    tl.call(() => { storm.mode = "converge"; storm.target = 2400; storm.shake = 14; }, [], 6.9)
      .fromTo(q(".bk-wash"), { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.in", immediateRender: false }, 7.1)
      .to(q(".bk-wash"), { backgroundColor: "#000", duration: 0.2 }, 8.05)
      .call(() => { storm.stop(); doneRef.current(); }, [], 8.3);

    return () => {
      tl.kill();
      storm.stop();
    };
  }, []);

  const art = single("cutin_sword");
  const vortex = single("vortex");
  const wall = single("bladewall_pink");

  return (
    <div className="bankai" ref={root}>
      {/* mini stage */}
      <div className="bk-stage" ref={stage}>
        <div className="bk-stagebg" style={{ backgroundImage: `url(${asset(STAGE_SRC)})` }} />
        <div className="bk-glow" />
        <div className="bk-stagefigs">
          <div className="bk-vortexwrap">
            <div className="bk-vortex" style={{ width: vortex.w * scale * 0.6, height: vortex.h * scale * 0.6 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(vortex.src)} alt="" draggable={false} />
            </div>
          </div>
          <div className="bk-figure">
            {wings && <Sprite name="byk_wings" fps={11} loop={false} scale={scale} style={{ zIndex: 0, opacity: 0.95 }} />}
            {byk === "stand" && <Sprite name="byk_bankai" order={[0]} scale={scale} />}
            {byk === "bankai" && <Sprite name="byk_bankai" fps={9} loop={false} scale={scale} />}
            {byk === "spread" && <Sprite name="byk_spread" fps={3} scale={scale} />}
            {sword && <Sprite name="byk_swordfall" fps={6} loop={false} scale={scale} style={{ zIndex: 2, marginLeft: 28 * scale }} />}
          </div>
        </div>
        {/* blade walls */}
        <div className="bk-blades bk-blades--l">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(wall.src)} alt="" draggable={false} />
        </div>
        <div className="bk-blades bk-blades--r">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(wall.src)} alt="" draggable={false} />
        </div>
        <div className="bk-whites">
          {BLADES.slice(4, 13).map((b, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} className="bk-white" src={asset(b.src)} alt="" draggable={false}
              style={{ left: `${6 + (i % 5) * 19 + (i >= 5 ? 8 : 0)}%`, height: `${38 + (i % 3) * 14}%`, transform: i % 2 ? "scaleX(-1)" : undefined }} />
          ))}
        </div>
        <div className="bk-kanjicol">
          {KANJI.map((k, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} className="bk-kanji" src={asset(k.src)} alt="" draggable={false} style={{ height: `${(k.h / 124) * 22}%` }} />
          ))}
        </div>
      </div>

      <canvas ref={canvas} className="bk-canvas" />

      <div className="bk-title">
        {["SENBONZAKURA", "KAGEYOSHI"].map((word, wi) => (
          <span key={wi} className="word">
            {word.split("").map((ch, i) => <span key={i}>{ch}</span>)}
          </span>
        ))}
      </div>

      <div className="bk-cutin">
        <div className="bk-cutin__lines" />
        <div className="bk-word">BANKAI</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bk-cutin__art" src={asset(art.src)} alt="" draggable={false} />
      </div>
      <div className="bk-flash" />
      <div className="bk-wash" />
    </div>
  );
}

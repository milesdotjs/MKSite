"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "@/lib/gsapSetup";
import { asset } from "@/lib/assets";
import { audio } from "@/lib/audio";
import type { HostDef } from "@/lib/hosts";
import Sprite from "./Sprite";
import { useStageScale } from "@/lib/useStageScale";

type Props = { host: HostDef; onDone: () => void };

type RivalState = "none" | "enter" | "idle" | "attack" | "win";
type HostState = "idle" | "hit";

/**
 * The rival shows up and claims the win the player earned.
 *   Byakuya: Ichigo dashes in, one slash, "I WON!"
 *   Pain:    Naruto dashes in, Rasengan, "I WIN! BELIEVE IT!"
 *   Piccolo: Goku teleports in, does nothing, "HEH! I WIN!"
 */
export default function WinCutscene({ host, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scale = useStageScale(stage, 230, 210);
  const [rival, setRival] = useState<RivalState>("none");
  const [hostState, setHostState] = useState<HostState>("idle");
  const [fx, setFx] = useState(false);
  const [line, setLine] = useState<null | { who: string; text: string; big?: boolean }>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    const shout = () => { setLine({ who: host.rival, text: host.lines.rivalShout, big: true }); audio.fanfare(); };

    if (host.id === "piccolo") {
      // Goku: Instant Transmission. No attack. He just arrives.
      tl.call(() => { setRival("enter"); audio.teleport(); }, [], 0.4)
        .fromTo(q(".wn-flash"), { opacity: 0.7 }, { opacity: 0, duration: 0.35, immediateRender: false }, 0.4)
        .call(() => setRival("idle"), [], 0.95)
        .call(() => setRival("win"), [], 1.6)
        .call(shout, [], 1.75)
        .fromTo(q(".wn-won"), { scale: 4, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: -6, duration: 0.2, ease: "power4.in" }, 1.75)
        .to(el, { x: -8, duration: 0.05, yoyo: true, repeat: 9 }, 1.95)
        .call(() => setLine({ who: host.name, text: host.lines.afterRival }), [], 3.4)
        .to(q(".wn-won"), { opacity: 0, duration: 0.3 }, 5.2)
        .to(el, { opacity: 0, duration: 0.35 }, 5.5)
        .call(() => doneRef.current(), [], 5.9);
    } else {
      const isPain = host.id === "pain";
      const hitAt = isPain ? 1.15 : 0.92;
      tl.call(() => setRival("enter"), [], 0.25)
        .fromTo(q(".wn-rival"), { xPercent: -260 }, { xPercent: 0, duration: 0.35, ease: "power4.out" }, 0.3)
        .fromTo(q(".wn-lines"), { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, 0.55)
        .call(() => { setRival("attack"); if (isPain) { audio.rasengan(); setFx(true); } else audio.slash(); }, [], 0.8)
        .fromTo(q(".wn-slash"), { scaleX: 0, opacity: isPain ? 0 : 1 }, { scaleX: 1, duration: 0.12, ease: "power4.in", immediateRender: false }, 0.8)
        .to(q(".wn-slash"), { opacity: 0, duration: 0.25 }, 0.95)
        .fromTo(q(".wn-flash"), { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, hitAt)
        .call(() => { setHostState("hit"); audio.hit(); }, [], hitAt)
        .to(el, { x: 6, duration: 0.04, yoyo: true, repeat: 7 }, hitAt)
        .call(() => { setFx(false); setRival("win"); }, [], 1.6)
        .call(shout, [], 1.75)
        .fromTo(q(".wn-won"), { scale: 4, opacity: 0, rotate: -8 }, { scale: 1, opacity: 1, rotate: -6, duration: 0.2, ease: "power4.in" }, 1.75)
        .to(el, { x: -8, duration: 0.05, yoyo: true, repeat: 9 }, 1.95)
        .call(() => setLine({ who: host.name, text: host.lines.afterRival }), [], 3.4)
        .to(q(".wn-won"), { opacity: 0, duration: 0.3 }, 5.2)
        .to(el, { opacity: 0, duration: 0.35 }, 5.5)
        .call(() => doneRef.current(), [], 5.9);
    }
    return () => { tl.kill(); };
  }, [host]);

  const hostIdle = host.id === "byakuya" ? { name: "byk_raise", order: [4] } : host.id === "pain" ? { name: "pain_palm", order: [2] } : { name: "pic_cape", order: undefined };
  const hostHit = host.id === "byakuya" ? "byk_clutch" : host.id === "pain" ? "pain_hit" : "pic_hit";
  const shoutLen = host.lines.rivalShout.length;
  const shoutSize = shoutLen <= 6 ? 9 : shoutLen <= 11 ? 7 : 5.6;

  return (
    <div className="win" ref={root}>
      <div className="wn-stage" ref={stage}>
        <div className="wn-stagebg" style={{ backgroundImage: `url(${asset(host.stage)})` }} />
        <div className="wn-lines" />
        <div className="wn-figs">
          <div className="wn-byakuya">
            {hostState === "idle" && <Sprite name={hostIdle.name} order={hostIdle.order} fps={4} scale={scale} flip />}
            {hostState === "hit" && <Sprite name={hostHit} fps={host.id === "pain" ? 10 : 5} loop={false} scale={scale} flip />}
          </div>
          <div className="wn-ichigo wn-rival">
            {host.id === "byakuya" && (
              <>
                {(rival === "enter" || rival === "idle" || rival === "attack") && <Sprite name="ich_idle" fps={8} scale={scale} />}
                {rival === "win" && <Sprite name="ich_raise" fps={10} loop={false} scale={scale} />}
              </>
            )}
            {host.id === "pain" && (
              <>
                {rival === "enter" && <Sprite name="nar_dash" fps={14} scale={scale} />}
                {rival === "idle" && <Sprite name="nar_idle" fps={8} scale={scale} />}
                {rival === "attack" && <Sprite name="nar_thrust" fps={12} loop={false} scale={scale} />}
                {rival === "win" && <Sprite name="nar_win" fps={6} loop={false} scale={scale} order={[0, 1, 0]} />}
                {fx && <Sprite name="nar_spiral" fps={1} scale={scale * 0.9} style={{ marginLeft: 60 * scale, marginBottom: 20 * scale, zIndex: 3, opacity: 0.9 }} />}
              </>
            )}
            {host.id === "piccolo" && (
              <>
                {rival === "enter" && <Sprite name="goku_appear" fps={7} loop={false} scale={scale} />}
                {rival === "idle" && <Sprite name="goku_idle" fps={6} scale={scale} />}
                {rival === "win" && <Sprite name="goku_win" fps={4} loop={false} scale={scale} />}
              </>
            )}
          </div>
        </div>
        <div className="wn-slash" />
        <div className="wn-flash" />
        <div className="wn-wonwrap"><div className="wn-won" style={{ fontSize: `calc(var(--u) * ${shoutSize})` }}>{host.lines.rivalShout}</div></div>
      </div>
      {line && (
        <div className={`dialogue dialogue--cut ${line.big ? "dialogue--shout" : ""}`}>
          <div className="dialogue__name">{line.who}</div>
          <div className="dialogue__text">{line.text}</div>
        </div>
      )}
    </div>
  );
}

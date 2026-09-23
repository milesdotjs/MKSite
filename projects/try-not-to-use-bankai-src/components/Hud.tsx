"use client";

import { asset, single } from "@/lib/assets";
import type { HostDef } from "@/lib/hosts";
import { MAX_STRIKES } from "@/lib/questions";

type Props = {
  host: HostDef;
  pressure: number; // 0..100
  timeLeft: number;
  timeMax: number;
  showTimer: boolean;
  index: number;
  total: number;
  strikes: number;
  score: number;
  seriesLabel: string;
};

const SEGMENTS = 20;

export default function Hud({ host, pressure, timeLeft, timeMax, showTimer, index, total, strikes, score, seriesLabel }: Props) {
  const face = single(host.face);
  const lit = Math.round((pressure / 100) * SEGMENTS);
  const danger = pressure >= 72;
  const secs = Math.max(0, Math.ceil(timeLeft));
  const low = showTimer && secs <= 5;
  const frac = timeMax > 0 ? Math.max(0, timeLeft / timeMax) : 1;

  return (
    <div className={`hud ${danger ? "hud--danger" : ""}`}>
      <div className="hud__face">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(face.src)} alt="" draggable={false} />
      </div>

      <div className="hud__mid">
        <div className="hud__name">{host.name} <span className="hud__sub">{host.meterLabel}</span></div>
        <div className="meter" aria-label={`${host.meterLabel} ${Math.round(pressure)} percent`}>
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span key={i} className={`meter__seg ${i < lit ? "is-lit" : ""} ${i >= SEGMENTS - 5 ? "is-hot" : ""}`} />
          ))}
          <span className={`meter__label ${danger ? "is-blink" : ""}`}>{danger ? host.dangerLabel : ""}</span>
        </div>
      </div>

      <div className={`hud__timer ${low ? "is-low" : ""} ${showTimer ? "" : "is-idle"}`}>
        <div className="hud__timernum">{showTimer ? String(secs).padStart(2, "0") : "--"}</div>
        <div className="hud__timerbar"><span style={{ transform: `scaleX(${showTimer ? frac : 0})` }} /></div>
      </div>

      <div className="hud__right">
        <div className="hud__strikes" aria-label={`${strikes} of ${MAX_STRIKES} mistakes`}>
          <span className="hud__strikeslabel">MISTAKES</span>
          {Array.from({ length: MAX_STRIKES }, (_, i) => (
            <span key={i} className={`strike ${i < strikes ? "is-hit" : ""}`}>{i < strikes ? "✕" : "○"}</span>
          ))}
        </div>
        <div className="hud__q">Q <b>{String(index + 1).padStart(2, "0")}</b>/{total}</div>
        <div className="hud__score">{String(score).padStart(5, "0")}</div>
        <div className="hud__series">{seriesLabel}</div>
      </div>
    </div>
  );
}

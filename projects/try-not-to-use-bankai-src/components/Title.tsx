"use client";

import { asset, single } from "@/lib/assets";
import type { HostDef, HostId } from "@/lib/hosts";
import { audio } from "@/lib/audio";

type Props = {
  hosts: HostDef[];
  hostId: HostId;
  highScore: number;
  muted: boolean;
  onSelect: (id: HostId) => void;
  onStart: () => void;
  onToggleMute: () => void;
};

export default function Title({ hosts, hostId, highScore, muted, onSelect, onStart, onToggleMute }: Props) {
  const host = hosts.find((h) => h.id === hostId) ?? hosts[0];
  return (
    <div className="title" onClick={onStart}>
      <div className="title__top">
        <div className="title__coin">INSERT COIN</div>
        <div className="title__hi">HI-SCORE {String(highScore).padStart(5, "0")}</div>
      </div>
      <div className="title__logo">
        <div className="title__line1">TRY NOT TO USE</div>
        <div className="title__line2" style={{ "--wm": host.wordmarkSize } as React.CSSProperties}>{host.wordmark}</div>
        <div className="title__tag">A TOTALLY FAIR ANIME TRIVIA GAME</div>
      </div>
      <div className="title__spacer" />
      <div className="select" onClick={(e) => e.stopPropagation()}>
        <div className="select__label">SELECT A CHALLENGE</div>
        <div className="select__row">
          {hosts.map((h) => {
            const face = single(h.face);
            const on = h.id === hostId;
            return (
              <button
                key={h.id}
                type="button"
                className={`select__card ${on ? "is-on" : ""}`}
                onClick={() => { audio.unlock(); if (!on) { audio.select(); onSelect(h.id); } }}
                aria-pressed={on}
              >
                <span className="select__face">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(face.src)} alt="" draggable={false} />
                </span>
                <b className="select__name">{h.name}</b>
                <span className="select__series">{h.seriesLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="title__press">PRESS START</div>
      <div className="title__bottom">
        <div className="title__spoilers">CONTAINS SPOILERS · BLEACH · NARUTO · DRAGON BALL · FULLMETAL ALCHEMIST · POKEMON · YU-GI-OH! · JUJUTSU KAISEN · YU YU HAKUSHO</div>
        <div className="title__row">
          <span>{host.rule}</span>
          <button
            type="button"
            className="title__mute"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
          >
            SOUND: {muted ? "OFF" : "ON"}
          </button>
        </div>
        <div className="title__credit">6TH DIVISION AMUSEMENTS · 199X</div>
      </div>
    </div>
  );
}

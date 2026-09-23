"use client";

import { useEffect, useState } from "react";
import type { HostDef } from "@/lib/hosts";
import { audio } from "@/lib/audio";

type Props = {
  host: HostDef;
  outcome: "win" | "lose";
  answered: number;
  total: number;
  score: number;
  strikes: number;
  highScore: number;
  isNewHigh: boolean;
  onContinue: () => void;
  onTitle: () => void;
};

export default function Result({ host, outcome, answered, total, score, strikes, highScore, isNewHigh, onContinue, onTitle }: Props) {
  const [count, setCount] = useState(9);
  const lose = outcome === "lose";

  // Arcade continue countdown. When it hits zero we fall back to the title.
  useEffect(() => {
    if (!lose) return;
    if (count <= 0) {
      onTitle();
      return;
    }
    const id = setTimeout(() => {
      audio.tick();
      setCount((c) => c - 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [count, lose, onTitle]);

  const rank = host.ranks(score, strikes);

  return (
    <div className={`result ${lose ? "result--lose" : "result--win"}`}>
      <div className="result__panel">
        {lose ? (
          <>
            <div className="result__head">{host.lose.head}</div>
            <div className="result__sub">{host.lose.sub}</div>
          </>
        ) : (
          <>
            <div className="result__head result__head--win">YOU WIN</div>
            <div className="result__sub">{host.winSub}</div>
          </>
        )}

        <dl className="result__stats">
          <dt>ANSWERED</dt><dd>{answered} / {total}</dd>
          <dt>MISTAKES</dt><dd>{strikes}</dd>
          <dt>SCORE</dt><dd>{String(score).padStart(5, "0")}{isNewHigh && <span className="result__new"> NEW!</span>}</dd>
          <dt>HI-SCORE</dt><dd>{String(highScore).padStart(5, "0")}</dd>
          {!lose && (
            <>
              <dt>RANK</dt><dd className="result__rank">{rank.title}</dd>
            </>
          )}
        </dl>
        {!lose && <div className="result__blurb">{rank.blurb}</div>}

        {lose ? (
          <div className="result__continue">
            CONTINUE? <span className="result__count">{count}</span>
          </div>
        ) : null}

        <div className="result__buttons">
          <button type="button" className="btn btn--primary" onClick={onContinue}>
            {lose ? "CONTINUE" : "PLAY AGAIN"}
          </button>
          <button type="button" className="btn" onClick={onTitle}>TITLE</button>
        </div>
      </div>
    </div>
  );
}

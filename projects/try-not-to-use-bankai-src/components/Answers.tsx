"use client";

import { audio } from "@/lib/audio";

const LETTERS = ["A", "B", "C", "D"];

type Props = {
  options: string[];
  correctIndex: number;
  selected: number | null;
  revealed: boolean;
  enabled: boolean;
  visible: boolean;
  onPick: (i: number) => void;
  debugCorrect?: number;
};

export default function Answers({ options, correctIndex, selected, revealed, enabled, visible, onPick, debugCorrect }: Props) {
  return (
    <div className={`answers ${visible ? "is-visible" : ""}`} data-correct={debugCorrect}>
      {options.map((opt, i) => {
        const isSel = selected === i;
        const cls = ["answer"];
        if (revealed) {
          if (i === correctIndex) cls.push("is-correct");
          else if (isSel) cls.push("is-wrong");
          else cls.push("is-faded");
        }
        if (isSel) cls.push("is-selected");
        return (
          <button
            key={i}
            type="button"
            className={cls.join(" ")}
            disabled={!enabled}
            onMouseEnter={() => enabled && audio.hover()}
            onClick={() => enabled && onPick(i)}
          >
            <span className="answer__key">{LETTERS[i]}</span>
            <span className="answer__text">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

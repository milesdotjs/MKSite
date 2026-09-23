"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { audio } from "@/lib/audio";

export type DialogueHandle = { advance: () => void };

type Props = {
  speaker: string;
  lines: string[];
  /** Change to restart with new lines */
  ticket: number;
  /** When true the last line fires onDone as soon as it finishes typing */
  autoLast?: boolean;
  charMs?: number;
  onDone?: () => void;
  /** Called when a line has fully typed (used to reveal answers) */
  onLineTyped?: (index: number) => void;
  dim?: boolean;
};

const DialogueBox = forwardRef<DialogueHandle, Props>(function DialogueBox(
  { speaker, lines, ticket, autoLast, charMs = 26, onDone, onLineTyped, dim },
  ref,
) {
  const [li, setLi] = useState(0);
  const [ci, setCi] = useState(0);
  const [typing, setTyping] = useState(true);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const typedRef = useRef(onLineTyped);
  typedRef.current = onLineTyped;

  const line = lines[Math.min(li, lines.length - 1)] ?? "";
  const last = li >= lines.length - 1;

  useEffect(() => {
    setLi(0);
    setCi(0);
    setTyping(true);
  }, [ticket]);

  // typewriter
  useEffect(() => {
    if (!typing) return;
    if (ci >= line.length) {
      setTyping(false);
      return;
    }
    const id = setTimeout(() => {
      setCi((c) => c + 1);
      if (ci % 2 === 0 && line[ci] !== " ") audio.blip();
    }, line[ci] === "." || line[ci] === "," ? charMs * 5 : charMs);
    return () => clearTimeout(id);
  }, [typing, ci, line, charMs]);

  // line finished
  useEffect(() => {
    if (typing) return;
    typedRef.current?.(li);
    if (last && autoLast) {
      const id = setTimeout(() => doneRef.current?.(), 250);
      return () => clearTimeout(id);
    }
  }, [typing, li, last, autoLast]);

  const advance = () => {
    if (typing) {
      setCi(line.length);
      setTyping(false);
      return;
    }
    if (last) {
      if (!autoLast) doneRef.current?.();
      return;
    }
    audio.select();
    setLi((l) => l + 1);
    setCi(0);
    setTyping(true);
  };

  useImperativeHandle(ref, () => ({ advance }), [advance]);

  const waiting = !typing && !(last && autoLast);
  return (
    <div className={`dialogue ${dim ? "dialogue--dim" : ""}`} onClick={advance} role="button" tabIndex={-1}>
      <div className="dialogue__name">{speaker}</div>
      <div className="dialogue__text">
        {line.slice(0, ci)}
        {typing && <span className="dialogue__caret">_</span>}
      </div>
      {waiting && <div className="dialogue__more">▼</div>}
    </div>
  );
});

export default DialogueBox;

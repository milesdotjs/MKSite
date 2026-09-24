"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { asset, preloadAll } from "@/lib/assets";
import { audio } from "@/lib/audio";
import { PetalStorm } from "@/lib/petals";
import { HOST_ORDER, HOSTS, isHostId, type HostId } from "@/lib/hosts";
import {
  buildRun, DIFF_MULT, MAX_STRIKES, RUN_LENGTH, SERIES_LABEL, timeFor, type RunQuestion,
} from "@/lib/questions";
import { addSeen, getHighScore, getHost, getMuted, getSeen, setHighScore, setHost, setMuted } from "@/lib/storage";
import { useStageScale } from "@/lib/useStageScale";
import AlmightyPushCutscene from "./AlmightyPushCutscene";
import Answers from "./Answers";
import BankaiCutscene from "./BankaiCutscene";
import DialogueBox, { type DialogueHandle } from "./DialogueBox";
import HostSprite, { type HostAnim } from "./HostSprite";
import Hud from "./Hud";
import Result from "./Result";
import SpecialBeamCutscene from "./SpecialBeamCutscene";
import FlameAlchemyCutscene from "./FlameAlchemyCutscene";
import ThunderboltCutscene from "./ThunderboltCutscene";
import Title from "./Title";
import WinCutscene from "./WinCutscene";

type Phase = "title" | "intro" | "ask" | "answering" | "feedback" | "finisher" | "win" | "result";

type Dialogue = { speaker: string; lines: string[]; ticket: number; autoLast: boolean };

const KEY_TO_INDEX: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };

function pressureFor(index: number, strikes: number, timeLeft: number, timeMax: number, answering: boolean) {
  const base = 6 + index * 6; // 6 .. 60
  const urgency = answering && timeMax > 0 ? (1 - timeLeft / timeMax) * 8 : 0;
  return Math.min(100, base + strikes * 24 + urgency);
}

export default function Game() {
  const [phase, setPhase] = useState<Phase>("title");
  const [hostId, setHostId] = useState<HostId>("byakuya");
  const [run, setRun] = useState<RunQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answersVisible, setAnswersVisible] = useState(false);
  const [dialogue, setDialogue] = useState<Dialogue>({ speaker: "", lines: [], ticket: 0, autoLast: false });
  const [anim, setAnim] = useState<HostAnim>("idle");
  const [animKey, setAnimKey] = useState(0);
  const [muted, setMutedState] = useState(false);
  const mutedRef = useRef(false);
  const [highScore, setHigh] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [outcome, setOutcome] = useState<"win" | "lose">("lose");
  const [ready, setReady] = useState(false);
  const [debug, setDebug] = useState(false);
  const [pendingDebug, setPendingDebug] = useState<Phase | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const scale = useStageScale(stageRef);
  const petalRef = useRef<HTMLCanvasElement>(null);
  const stormRef = useRef<PetalStorm | null>(null);
  const dlgRef = useRef<DialogueHandle>(null);
  const ticketRef = useRef(0);
  const afterDialogue = useRef<() => void>(() => {});

  const host = HOSTS[hostId];
  const q = run[index];
  const timeMax = timeFor(index);
  const pressure = pressureFor(index, strikes, timeLeft, timeMax, phase === "answering");
  const playing = phase === "intro" || phase === "ask" || phase === "answering" || phase === "feedback";

  // ---- boot: storage, preload, ambient petals
  useEffect(() => {
    setHigh(getHighScore());
    const m = getMuted();
    setMutedState(m);
    mutedRef.current = m;
    audio.setMuted(m);
    void preloadAll().then(() => setReady(true));

    const params = new URLSearchParams(window.location.search);
    const savedHost = params.get("host") ?? getHost();
    const bootHost: HostId = isHostId(savedHost) ? savedHost : "byakuya";
    setHostId(bootHost);

    // Dev hook: ?debug=finisher|win|lose jumps straight to that beat (cutscenes
    // wait for a key so the screenshot rig can time them); ?debug=1 marks the
    // correct answer in the DOM. `bankai` is kept as an alias for finisher.
    const dbg = params.get("debug");
    if (dbg) {
      setDebug(true);
      const target: Phase | null = dbg === "bankai" || dbg === "finisher" ? "finisher" : dbg === "win" ? "win" : dbg === "lose" ? "result" : null;
      if (target) {
        setRun(buildRun(HOSTS[bootHost].series, new Set(), HOSTS[bootHost].solo));
        setStrikes(target === "finisher" ? 2 : 0);
        setScore(2480);
        setAnswered(target === "win" ? 10 : 4);
        setOutcome(target === "win" ? "win" : "lose");
        if (target === "result") setPhase("result");
        else setPendingDebug(target);
      }
    }

    const storm = new PetalStorm(petalRef.current!);
    storm.mode = "drift";
    storm.target = 0;
    storm.start();
    stormRef.current = storm;

    const unlock = () => audio.unlock();
    window.addEventListener("pointerdown", unlock, { once: true });
    return () => {
      storm.stop();
      window.removeEventListener("pointerdown", unlock);
    };
  }, []);

  useEffect(() => {
    if (!pendingDebug) return;
    const go = () => { setPhase(pendingDebug); setPendingDebug(null); };
    window.addEventListener("keydown", go, { once: true });
    window.addEventListener("pointerdown", go, { once: true });
    return () => { window.removeEventListener("keydown", go); window.removeEventListener("pointerdown", go); };
  }, [pendingDebug]);

  // ---- escalation: ambient petals and rumble follow pressure
  useEffect(() => {
    const s = stormRef.current;
    if (!s) return;
    const onTitle = phase === "title";
    // Piccolo's canyon has a constant wind while his cape is on (that is the aura
    // farming); Pain's rocks get the same wind so the cloak reads as blowing.
    const windy = (hostId === "piccolo" && strikes === 0) || (HOSTS[hostId].windy && hostId !== "piccolo");
    if (windy && (onTitle || playing)) {
      if (s.mode !== "wind") { s.clear(); s.mode = "wind"; }
      s.target = 28;
      s.wind = 1;
    } else if (s.mode === "wind") {
      s.clear();
      s.mode = "drift";
    }
    if (!playing) {
      if (s.mode !== "wind") s.target = onTitle && hostId === "byakuya" ? 4 : 0;
      audio.setRumble(0);
      return;
    }
    // Only Byakuya's stage sheds petals; the others just rumble.
    if (s.mode !== "wind") {
      s.target = hostId !== "byakuya" || pressure < 30 ? 0 : Math.round(((pressure - 30) / 70) * 70);
      s.wind = 0.6 + (pressure / 100) * 1.2;
    }
    audio.setRumble(pressure < 25 ? 0 : (pressure - 25) / 75);
  }, [pressure, playing, phase, hostId, strikes]);

  // ---- helpers
  const say = useCallback((lines: string[], autoLast: boolean, then: () => void, speaker: string) => {
    ticketRef.current += 1;
    afterDialogue.current = then;
    setDialogue({ speaker, lines: lines.filter(Boolean), ticket: ticketRef.current, autoLast });
  }, []);

  const askQuestion = useCallback((i: number, strikesNow: number, runNow: RunQuestion[], hid: HostId) => {
    const h = HOSTS[hid];
    const question = runNow[i];
    setIndex(i);
    setSelected(null);
    setRevealed(false);
    setAnswersVisible(false);
    setTimeLeft(timeFor(i));
    setPhase("ask");
    const prefix = h.lines.askPrefix(i, strikesNow);
    say([`${prefix ? prefix + " " : ""}${question.q}`], true, () => {
      setAnswersVisible(true);
      setPhase("answering");
    }, h.name);
  }, [say]);

  const startRun = useCallback(() => {
    audio.unlock();
    audio.coin();
    const h = HOSTS[hostId];
    const newRun = buildRun(h.series, getSeen(), h.solo);
    setRun(newRun);
    setIndex(0);
    setStrikes(0);
    setScore(0);
    setAnswered(0);
    setSelected(null);
    setRevealed(false);
    setAnswersVisible(false);
    setIsNewHigh(false);
    setAnim("idle");
    setAnimKey((k) => k + 1);
    setPhase("intro");
    say(h.lines.intro, false, () => askQuestion(0, 0, newRun, hostId), h.name);
  }, [askQuestion, say, hostId]);

  const finishRun = useCallback((won: boolean, finalScore: number, ids: string[]) => {
    addSeen(ids);
    setOutcome(won ? "win" : "lose");
    if (finalScore > highScore) {
      setHighScore(finalScore);
      setHigh(finalScore);
      setIsNewHigh(true);
    }
    if (!won) audio.gameOver();
    setPhase("result");
  }, [highScore]);

  const resolve = useCallback((pick: number | null) => {
    if (!q || phase !== "answering") return;
    const h = HOSTS[hostId];
    const correct = pick !== null && pick === q.correctIndex;
    setSelected(pick);
    setRevealed(true);
    setPhase("feedback");
    setAnswered((n) => n + 1);
    const nextIndex = index + 1;

    if (correct) {
      const fast = timeLeft > timeMax * 0.6;
      const gained = 100 * DIFF_MULT[q.difficulty] + Math.ceil(timeLeft) * 10;
      setScore(score + gained);
      audio.correct();
      setAnim("ack");
      setAnimKey((k) => k + 1);
      if (nextIndex >= RUN_LENGTH) {
        say(h.lines.win, false, () => setPhase("win"), h.name);
      } else {
        say([h.lines.correct(index, strikes, fast)], true, () => setTimeout(() => askQuestion(nextIndex, strikes, run, hostId), 350), h.name);
      }
      return;
    }

    const strikesAfter = strikes + 1;
    setStrikes(strikesAfter);
    const answerText = q.shuffled[q.correctIndex];
    audio.strike();
    setAnim("strike");
    setAnimKey((k) => k + 1);
    if (strikesAfter >= MAX_STRIKES) {
      say(h.lines.wrong(answerText, strikesAfter, pick === null), false, () => setPhase("finisher"), h.name);
    } else if (nextIndex >= RUN_LENGTH) {
      // A first mistake on the final question is still a pass: no eleventh question to ask.
      say([...h.lines.wrong(answerText, strikesAfter, pick === null), ...h.lines.win], false, () => setPhase("win"), h.name);
    } else {
      say(h.lines.wrong(answerText, strikesAfter, pick === null), false, () => askQuestion(nextIndex, strikesAfter, run, hostId), h.name);
    }
  }, [q, phase, index, timeLeft, timeMax, score, strikes, run, say, askQuestion, hostId]);

  // ---- timer
  useEffect(() => {
    if (phase !== "answering") return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 0.1)), 100);
    return () => clearInterval(id);
  }, [phase]);

  const lastTick = useRef(-1);
  useEffect(() => {
    if (phase !== "answering") { lastTick.current = -1; return; }
    const s = Math.ceil(timeLeft);
    if (s <= 5 && s !== lastTick.current) {
      lastTick.current = s;
      if (s > 0) audio.tick();
    }
    if (timeLeft <= 0) resolve(null);
  }, [timeLeft, phase, resolve]);

  const selectHost = useCallback((id: HostId) => {
    setHostId(id);
    setHost(id);
    setStrikes(0);
    setAnim("idle");
    setAnimKey((k) => k + 1);
  }, []);

  const toggleMute = () => {
    const m = !mutedRef.current;
    mutedRef.current = m;
    setMutedState(m);
    setMuted(m);
    audio.unlock();
    audio.setMuted(m);
  };
  // Back to the title means a clean slate: no strikes, so Piccolo's cape is
  // back on, the wind is blowing, and every host is in their idle pose.
  const goTitle = useCallback(() => {
    setStrikes(0);
    setScore(0);
    setAnswered(0);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setAnswersVisible(false);
    setAnim("idle");
    setAnimKey((k) => k + 1);
    setPhase("title");
  }, []);

  // ---- keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "m" || e.key === "M") { toggleMute(); return; }
      if (phase === "title") {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); startRun(); return; }
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          const i = HOST_ORDER.indexOf(hostId);
          const n = (i + (e.key === "ArrowRight" ? 1 : HOST_ORDER.length - 1)) % HOST_ORDER.length;
          audio.unlock();
          audio.select();
          selectHost(HOST_ORDER[n]);
          return;
        }
      }
      if ((phase === "intro" || phase === "ask" || phase === "feedback") && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        dlgRef.current?.advance();
        return;
      }
      if (phase === "answering") {
        const i = KEY_TO_INDEX[e.key.toLowerCase()];
        if (i !== undefined) { audio.select(); resolve(i); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, startRun, resolve, hostId, selectHost]);

  const onFinisherDone = useCallback(() => finishRun(false, score, run.map((r) => r.id)), [finishRun, score, run]);
  const onWinDone = useCallback(() => finishRun(true, score, run.map((r) => r.id)), [finishRun, score, run]);

  const stageStyle = useMemo(() => ({ backgroundImage: `url(${asset(host.stage)})` }), [host.stage]);
  const dark = Math.min(0.55, Math.max(0, (pressure - 20) / 100));
  const hostList = HOST_ORDER.map((id) => HOSTS[id]);

  return (
    <div className={`screen ${playing ? "is-playing" : ""} ${pressure >= 72 && playing ? "is-danger" : ""}`} data-phase={phase} data-host={hostId}>
      {playing && q && (
        <Hud
          host={host}
          pressure={pressure}
          timeLeft={timeLeft}
          timeMax={timeMax}
          showTimer={phase === "answering"}
          index={index}
          total={RUN_LENGTH}
          strikes={strikes}
          score={score}
          seriesLabel={SERIES_LABEL[q.series]}
        />
      )}
      {playing && !q && <div className="hud hud--blank" />}

      <div className="stage" ref={stageRef} style={stageStyle}>
        <div className="stage__dark" style={{ opacity: playing ? dark : 0.35 }} />
        {hostId === "piccolo" && strikes === 0 && (phase === "title" || playing) && <div className="stage__aura" />}
        <div className="stage__floor">
          <div className="stage__byakuya">
            {ready && <HostSprite host={host} anim={anim} struck={strikes > 0} scale={scale * (host.scaleMul ?? 1)} playKey={animKey} />}
            {hostId === "pikachu" && strikes > 0 && playing && (
              <div className="stage__sparks" style={{ "--s": `${scale * (host.scaleMul ?? 1)}` } as React.CSSProperties}><i /><i /></div>
            )}
          </div>
        </div>
        <canvas ref={petalRef} className="stage__petals" />
        <div className="stage__vignette" />
      </div>

      {playing && (
        <DialogueBox
          ref={dlgRef}
          speaker={dialogue.speaker}
          lines={dialogue.lines}
          ticket={dialogue.ticket}
          autoLast={dialogue.autoLast}
          onDone={() => afterDialogue.current()}
          dim={phase === "answering"}
        />
      )}

      {playing && (
        <Answers
          options={q?.shuffled ?? ["", "", "", ""]}
          correctIndex={q?.correctIndex ?? -1}
          selected={selected}
          revealed={revealed}
          enabled={phase === "answering"}
          visible={answersVisible && (phase === "answering" || phase === "feedback")}
          onPick={(i) => { audio.select(); resolve(i); }}
          debugCorrect={debug ? q?.correctIndex : undefined}
        />
      )}

      {phase === "title" && !pendingDebug && (
        <Title hosts={hostList} hostId={hostId} highScore={highScore} muted={muted} onSelect={selectHost} onStart={startRun} onToggleMute={toggleMute} />
      )}
      {pendingDebug && <div className="title" style={{ cursor: "default" }}><div className="title__press">DEBUG: PRESS ANY KEY FOR {pendingDebug.toUpperCase()}</div></div>}
      {phase === "finisher" && hostId === "byakuya" && <BankaiCutscene onDone={onFinisherDone} />}
      {phase === "finisher" && hostId === "pain" && <AlmightyPushCutscene onDone={onFinisherDone} />}
      {phase === "finisher" && hostId === "piccolo" && <SpecialBeamCutscene onDone={onFinisherDone} />}
      {phase === "finisher" && hostId === "mustang" && <FlameAlchemyCutscene onDone={onFinisherDone} />}
      {phase === "finisher" && hostId === "pikachu" && <ThunderboltCutscene onDone={onFinisherDone} />}
      {phase === "win" && <WinCutscene host={host} onDone={onWinDone} />}
      {phase === "result" && (
        <Result
          host={host}
          outcome={outcome}
          answered={answered}
          total={RUN_LENGTH}
          score={score}
          strikes={strikes}
          highScore={highScore}
          isNewHigh={isNewHigh}
          onContinue={startRun}
          onTitle={goTitle}
        />
      )}

      <div className="crt" aria-hidden="true" />
      <button type="button" className="mutebtn" onClick={toggleMute} aria-label="Toggle sound">{muted ? "♪ OFF" : "♪ ON"}</button>
    </div>
  );
}

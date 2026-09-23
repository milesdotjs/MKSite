import gsap from "gsap";

// Cutscene sound is scheduled on the AudioContext clock, so the visuals must
// track wall time too. Lag smoothing would let GSAP fall behind after a
// stutter and drift out of sync with the audio (and, incidentally, makes
// headless screenshots land on the wrong frame).
if (typeof window !== "undefined") {
  gsap.ticker.lagSmoothing(0);
}

export default gsap;

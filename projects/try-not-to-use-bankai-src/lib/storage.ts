// Every access is wrapped: private windows and blocked storage throw.
const KEY_HI = "tntub.highscore";
const KEY_SEEN = "tntub.seen";
const KEY_MUTE = "tntub.muted";
const KEY_HOST = "tntub.host";
const SEEN_CAP = 120;

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function getHighScore(): number {
  const v = Number(read(KEY_HI));
  return Number.isFinite(v) ? v : 0;
}
export function setHighScore(n: number) {
  write(KEY_HI, String(n));
}

export function getSeen(): Set<string> {
  try {
    const arr = JSON.parse(read(KEY_SEEN) ?? "[]");
    return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}
export function addSeen(ids: string[]) {
  const arr = [...getSeen(), ...ids];
  write(KEY_SEEN, JSON.stringify(arr.slice(-SEEN_CAP)));
}

export function getMuted(): boolean {
  return read(KEY_MUTE) === "1";
}
export function setMuted(m: boolean) {
  write(KEY_MUTE, m ? "1" : "0");
}

export function getHost(): string | null {
  return read(KEY_HOST);
}
export function setHost(id: string) {
  write(KEY_HOST, id);
}

import { Chess } from "chess.js";
import { Chessground } from "chessground";

const playerSelect = document.getElementById("player");
const maxGamesInput = document.getElementById("maxGames");
const randomBtn = document.getElementById("randomBtn");
const gameInfo = document.getElementById("gameInfo");
const gameViewer = document.getElementById("gameViewer");

const PLAYERS = [
    // World Champions (in order)
    { id: "morphy", label: "Paul Morphy", file: "pgn/Morphy.pgn", group: "World Champions & Pre-Champions" },
    { id: "anderssen", label: "Adolf Anderssen", file: "pgn/Anderssen.pgn", group: "World Champions & Pre-Champions" },
    { id: "lasker", label: "Emanuel Lasker", file: "pgn/Lasker.pgn", group: "World Champions & Pre-Champions" },
    { id: "capablanca", label: "José Raúl Capablanca", file: "pgn/Capablanca.pgn", group: "World Champions & Pre-Champions" },
    { id: "alekhine", label: "Alexander Alekhine", file: "pgn/Alekhine.pgn", group: "World Champions & Pre-Champions" },
    { id: "euwe", label: "Max Euwe", file: "pgn/Euwe.pgn", group: "World Champions & Pre-Champions" },
    { id: "botvinnik", label: "Mikhail Botvinnik", file: "pgn/Botvinnik.pgn", group: "World Champions & Pre-Champions" },
    { id: "smyslov", label: "Vasily Smyslov", file: "pgn/Smyslov.pgn", group: "World Champions & Pre-Champions" },
    { id: "tal", label: "Mikhail Tal", file: "pgn/Tal.pgn", group: "World Champions & Pre-Champions" },
    { id: "petrosian", label: "Tigran Petrosian", file: "pgn/Petrosian.pgn", group: "World Champions & Pre-Champions" },
    { id: "spassky", label: "Boris Spassky", file: "pgn/Spassky.pgn", group: "World Champions & Pre-Champions" },
    { id: "fischer", label: "Bobby Fischer", file: "pgn/Fischer.pgn", group: "World Champions & Pre-Champions" },
    { id: "karpov", label: "Anatoly Karpov", file: "pgn/Karpov.pgn", group: "World Champions & Pre-Champions" },
    { id: "kasparov", label: "Garry Kasparov", file: "pgn/Kasparov.pgn", group: "World Champions & Pre-Champions" },
    { id: "anand", label: "Viswanathan Anand", file: "pgn/Anand.pgn", group: "World Champions & Pre-Champions" },
    { id: "carlsen", label: "Magnus Carlsen", file: "pgn/Carlsen.pgn", group: "World Champions & Pre-Champions" },
    { id: "ding", label: "Ding Liren", file: "pgn/Ding.pgn", group: "World Champions & Pre-Champions" },

    // Top elite contemporary
    { id: "nakamura", label: "Hikaru Nakamura", file: "pgn/Nakamura.pgn", group: "Elite Contemporary" },
    { id: "firouzja", label: "Alireza Firouzja", file: "pgn/Firouzja.pgn", group: "Elite Contemporary" },
    { id: "caruana", label: "Fabiano Caruana", file: "pgn/Caruana.pgn", group: "Elite Contemporary" },
    { id: "nepomniachtchi", label: "Ian Nepomniachtchi", file: "pgn/Nepomniachtchi.pgn", group: "Elite Contemporary" },
    { id: "aronian", label: "Levon Aronian", file: "pgn/Aronian.pgn", group: "Elite Contemporary" },
    { id: "mvl", label: "Maxime Vachier-Lagrave", file: "pgn/VachierLagrave.pgn", group: "Elite Contemporary" },
    { id: "giri", label: "Anish Giri", file: "pgn/Giri.pgn", group: "Elite Contemporary" },
    { id: "grischuk", label: "Alexander Grischuk", file: "pgn/Grischuk.pgn", group: "Elite Contemporary" },
    { id: "so", label: "Wesley So", file: "pgn/So.pgn", group: "Elite Contemporary" },
    { id: "rapport", label: "Richard Rapport", file: "pgn/Rapport.pgn", group: "Elite Contemporary" },
    { id: "topalov", label: "Veselin Topalov", file: "pgn/Topalov.pgn", group: "Elite Contemporary" },
    { id: "ivanchuk", label: "Vasyl Ivanchuk", file: "pgn/Ivanchuk.pgn", group: "Elite Contemporary" },
    { id: "leko", label: "Peter Leko", file: "pgn/Leko.pgn", group: "Elite Contemporary" },
    { id: "gelfand", label: "Boris Gelfand", file: "pgn/Gelfand.pgn", group: "Elite Contemporary" },
    { id: "shirov", label: "Alexei Shirov", file: "pgn/Shirov.pgn", group: "Elite Contemporary" },
    { id: "kamsky", label: "Gata Kamsky", file: "pgn/Kamsky.pgn", group: "Elite Contemporary" },
    { id: "adams", label: "Michael Adams", file: "pgn/Adams.pgn", group: "Elite Contemporary" },
    { id: "short", label: "Nigel Short", file: "pgn/Short.pgn", group: "Elite Contemporary" },
    { id: "dominguez", label: "Leinier Domínguez", file: "pgn/DominguezPerez.pgn", group: "Elite Contemporary" },
    { id: "andreikin", label: "Dmitry Andreikin", file: "pgn/Andreikin.pgn", group: "Elite Contemporary" },
    { id: "bacrot", label: "Étienne Bacrot", file: "pgn/Bacrot.pgn", group: "Elite Contemporary" },
    { id: "wangh", label: "Wang Hao", file: "pgn/WangH.pgn", group: "Elite Contemporary" },
    { id: "le", label: "Lê Quang Liêm", file: "pgn/Le.pgn", group: "Elite Contemporary" },
    { id: "korobov", label: "Anton Korobov", file: "pgn/Korobov.pgn", group: "Elite Contemporary" },
    { id: "jobava", label: "Baadur Jobava", file: "pgn/Jobava.pgn", group: "Elite Contemporary" },

    // Rising stars
    { id: "gukesh", label: "Gukesh D", file: "pgn/Gukesh.pgn", group: "Rising Stars" },
    { id: "praggnanandhaa", label: "R Praggnanandhaa", file: "pgn/Praggnanandhaa.pgn", group: "Rising Stars" },
    { id: "abdusattorov", label: "Nodirbek Abdusattorov", file: "pgn/Abdusattorov.pgn", group: "Rising Stars" },
    { id: "wei", label: "Wei Yi", file: "pgn/Wei.pgn", group: "Rising Stars" },
    { id: "yu", label: "Yu Yangyi", file: "pgn/Yu.pgn", group: "Rising Stars" },
    { id: "keymer", label: "Vincent Keymer", file: "pgn/Keymer.pgn", group: "Rising Stars" },

    // Historical legends (non-champions)
    { id: "philidor", label: "François-André Philidor", file: "pgn/Philidor.pgn", group: "Historical Legends" },
    { id: "mcdonnell", label: "Alexander McDonnell", file: "pgn/McDonnell.pgn", group: "Historical Legends" },
    { id: "chigorin", label: "Mikhail Chigorin", file: "pgn/Chigorin.pgn", group: "Historical Legends" },
    { id: "blackburne", label: "Joseph Blackburne", file: "pgn/Blackburne.pgn", group: "Historical Legends" },
    { id: "tarrasch", label: "Siegbert Tarrasch", file: "pgn/Tarrasch.pgn", group: "Historical Legends" },
    { id: "pillsbury", label: "Harry Nelson Pillsbury", file: "pgn/Pillsbury.pgn", group: "Historical Legends" },
    { id: "marshall", label: "Frank Marshall", file: "pgn/Marshall.pgn", group: "Historical Legends" },
    { id: "reti", label: "Richard Réti", file: "pgn/Reti.pgn", group: "Historical Legends" },
    { id: "saemisch", label: "Friedrich Sämisch", file: "pgn/Saemisch.pgn", group: "Historical Legends" },
    { id: "najdorf", label: "Miguel Najdorf", file: "pgn/Najdorf.pgn", group: "Historical Legends" },
    { id: "reshevsky", label: "Samuel Reshevsky", file: "pgn/Reshevsky.pgn", group: "Historical Legends" },
    { id: "korchnoi", label: "Viktor Korchnoi", file: "pgn/Korchnoi.pgn", group: "Historical Legends" },
    { id: "larsen", label: "Bent Larsen", file: "pgn/Larsen.pgn", group: "Historical Legends" },
    { id: "andersson", label: "Ulf Andersson", file: "pgn/Andersson.pgn", group: "Historical Legends" },
    { id: "byrne", label: "Robert Byrne", file: "pgn/Byrne.pgn", group: "Historical Legends" },
    { id: "benko", label: "Pal Benko", file: "pgn/Benko.pgn", group: "Historical Legends" },
    { id: "evans", label: "Larry Evans", file: "pgn/Evans.pgn", group: "Historical Legends" },
    { id: "nunn", label: "John Nunn", file: "pgn/Nunn.pgn", group: "Historical Legends" },
    { id: "seirawan", label: "Yasser Seirawan", file: "pgn/Seirawan.pgn", group: "Historical Legends" },

    // Women's champions and top women
    { id: "polgarj", label: "Judit Polgár", file: "pgn/PolgarJ.pgn", group: "Women's Greats" },
    { id: "polgars", label: "Susan Polgár", file: "pgn/PolgarS.pgn", group: "Women's Greats" },
    { id: "polgarz", label: "Sofia Polgár", file: "pgn/PolgarZ.pgn", group: "Women's Greats" },
    { id: "hou", label: "Hou Yifan", file: "pgn/Hou.pgn", group: "Women's Greats" },
    { id: "kosteniuk", label: "Alexandra Kosteniuk", file: "pgn/Kosteniuk.pgn", group: "Women's Greats" },
    { id: "muzychuk", label: "Anna Muzychuk", file: "pgn/Muzychuk.pgn", group: "Women's Greats" },
    { id: "gaprindashvili", label: "Nona Gaprindashvili", file: "pgn/Gaprindashvili.pgn", group: "Women's Greats" },
    { id: "krush", label: "Irina Krush", file: "pgn/Krush.pgn", group: "Women's Greats" },

    // American GMs / commentators
    { id: "ashley", label: "Maurice Ashley", file: "pgn/Ashley.pgn", group: "American GMs" },
    { id: "finegold", label: "Ben Finegold", file: "pgn/Finegold.pgn", group: "American GMs" },
    { id: "shabalov", label: "Alexander Shabalov", file: "pgn/Shabalov.pgn", group: "American GMs" },
    { id: "onischuk", label: "Alexander Onischuk", file: "pgn/Onischuk.pgn", group: "American GMs" },
    { id: "dzindzichashvili", label: "Roman Dzindzichashvili", file: "pgn/Dzindzichashvili.pgn", group: "American GMs" },
];

function populatePlayerDropdown() {
    const groups = {};
    for (const p of PLAYERS) {
        (groups[p.group] ||= []).push(p);
    }
    for (const [groupLabel, list] of Object.entries(groups)) {
        const og = document.createElement("optgroup");
        og.label = groupLabel;
        for (const p of list) {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.label;
            og.appendChild(opt);
        }
        playerSelect.appendChild(og);
    }
    const tal = PLAYERS.find((p) => p.id === "tal");
    if (tal) playerSelect.value = tal.id;
}

populatePlayerDropdown();

// --- PGN parsing ---------------------------------------------------------

function splitPgnGames(pgnText) {
    const games = [];
    const lines = pgnText.split(/\r?\n/);
    let current = [];
    let inMoves = false;

    for (const line of lines) {
        const isHeader = line.startsWith("[");
        if (isHeader && inMoves && current.length) {
            games.push(current.join("\n"));
            current = [];
            inMoves = false;
        }
        if (!isHeader && line.trim() !== "") inMoves = true;
        current.push(line);
    }
    if (current.length && current.some((l) => l.trim())) {
        games.push(current.join("\n"));
    }
    return games.map((g) => g.trim()).filter(Boolean);
}

function parsePgnHeaders(pgnText) {
    const headers = {};
    const re = /^\[(\w+)\s+"([^"]*)"\]/gm;
    let m;
    while ((m = re.exec(pgnText)) !== null) {
        headers[m[1]] = m[2];
    }
    return headers;
}

function extractMoves(pgnText) {
    const lines = pgnText.split(/\r?\n/);
    const moveLines = lines.filter((l) => !l.startsWith("[")).join(" ");
    return moveLines.replace(/\{[^}]*\}/g, "").replace(/\s+/g, " ").trim();
}

function moveCountFromPgn(movesText) {
    if (!movesText) return "—";
    const cleaned = movesText
        .replace(/\d+\.(\.\.)?/g, "")
        .replace(/(1-0|0-1|1\/2-1\/2|\*)\s*$/, "")
        .trim();
    if (!cleaned) return "—";
    return cleaned.split(/\s+/).length;
}

// --- Lichess import ------------------------------------------------------

const IMPORT_CACHE_VERSION = "v2";
const importCache = (() => {
    try {
        const raw = JSON.parse(localStorage.getItem("importCache") || "{}");
        if (raw.__version !== IMPORT_CACHE_VERSION) return { __version: IMPORT_CACHE_VERSION };
        return raw;
    } catch {
        return { __version: IMPORT_CACHE_VERSION };
    }
})();

function persistImportCache() {
    try {
        localStorage.setItem("importCache", JSON.stringify(importCache));
    } catch (err) {
        console.warn("Could not persist import cache:", err);
    }
}

function hashPgn(pgn) {
    let h = 5381;
    for (let i = 0; i < pgn.length; i++) {
        h = ((h << 5) + h + pgn.charCodeAt(i)) | 0;
    }
    return String(h);
}

async function importPgnToLichess(pgn) {
    const key = hashPgn(pgn);
    if (importCache[key]) return importCache[key];

    const body = new URLSearchParams({ pgn });
    const res = await fetch("https://lichess.org/api/import", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
        },
        body,
    });
    if (!res.ok) {
        if (res.status === 429) {
            throw new Error("Lichess rate limit hit (~200 imports/day per IP). Try again later.");
        }
        throw new Error(`Lichess import failed: ${res.status} ${res.statusText}`);
    }

    let id, url;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        const data = await res.json();
        id = data.id;
        url = data.url;
    } else {
        // Lichess sometimes responds with a redirect / HTML page; the final URL contains the game ID.
        url = res.url;
        const match = res.url.match(/lichess\.org\/([A-Za-z0-9]{8,12})/);
        if (match) id = match[1];
    }

    if (!id) {
        throw new Error("Could not determine imported game ID from Lichess response.");
    }

    importCache[key] = { id, url: url || `https://lichess.org/${id}` };
    persistImportCache();
    return importCache[key];
}

// --- Source: bundled -----------------------------------------------------

async function loadBundledGames(player, maxGames) {
    let res;
    try {
        res = await fetch(player.file);
    } catch (err) {
        throw new Error(`Could not load ${player.file}: ${err.message}`);
    }
    if (!res.ok) {
        throw new Error(
            `Missing PGN file (${player.file}). Drop a PGN archive of ${player.label}'s games into the pgn/ folder. See pgn/README.md.`,
        );
    }
    const text = await res.text();
    const all = splitPgnGames(text);
    if (all.length === 0) {
        throw new Error(`No games parsed from ${player.file}.`);
    }
    if (all.length > maxGames) {
        const sample = [];
        const used = new Set();
        while (sample.length < maxGames) {
            const i = Math.floor(Math.random() * all.length);
            if (!used.has(i)) {
                used.add(i);
                sample.push(all[i]);
            }
        }
        return sample;
    }
    return all;
}

// --- Rendering -----------------------------------------------------------

function showLoading(msg = "Loading games…") {
    gameInfo.classList.add("empty");
    gameInfo.innerHTML = `<p class="placeholder">${msg}</p>`;
    gameViewer.classList.add("empty");
    gameViewer.innerHTML = `<p class="placeholder-large">${msg}</p>`;
}

function showError(message) {
    gameInfo.classList.add("empty");
    gameInfo.innerHTML = `<p class="placeholder">⚠ ${message}</p>`;
    gameViewer.classList.add("empty");
    gameViewer.innerHTML = `<p class="placeholder-large">⚠ ${message}</p>`;
}

function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function resultSymbol(result) {
    if (result === "1-0") return "1–0";
    if (result === "0-1") return "0–1";
    if (result === "1/2-1/2") return "½–½";
    return result || "—";
}

function renderSidebarInfo({ headers, movesText, lichess }) {
    const white = escapeHtml(headers.White || "?");
    const black = escapeHtml(headers.Black || "?");
    const whiteElo = headers.WhiteElo ? ` (${escapeHtml(headers.WhiteElo)})` : "";
    const blackElo = headers.BlackElo ? ` (${escapeHtml(headers.BlackElo)})` : "";
    const event = escapeHtml(headers.Event || "—");
    const site = escapeHtml(headers.Site || "—");
    const date = escapeHtml(headers.Date || "—");
    const opening = escapeHtml(headers.Opening || headers.ECO || "—");
    const result = resultSymbol(headers.Result);

    const gameUrl = lichess?.url || (lichess?.id ? `https://lichess.org/${lichess.id}` : "#");
    const analysisUrl = lichess?.id ? `https://lichess.org/${lichess.id}#0` : gameUrl;

    gameInfo.classList.remove("empty");
    gameInfo.innerHTML = `
        <h2 class="info-title">${white} <span class="vs">vs</span> ${black}</h2>
        <p class="info-subtitle">${result} · ${date}</p>
        <div class="game-detail">
            <div class="row"><span class="label">Event</span><span class="value">${event}</span></div>
            <div class="row"><span class="label">Site</span><span class="value">${site}</span></div>
            <div class="row"><span class="label">White</span><span class="value">${white}${whiteElo}</span></div>
            <div class="row"><span class="label">Black</span><span class="value">${black}${blackElo}</span></div>
            <div class="row"><span class="label">Opening</span><span class="value">${opening}</span></div>
            <div class="row"><span class="label">Moves</span><span class="value">${moveCountFromPgn(movesText)}</span></div>
        </div>
        ${
            lichess?.id
                ? `<div class="info-actions">
                        <a class="btn-primary" href="${analysisUrl}" target="_blank" rel="noopener">Analyze on Lichess</a>
                        <a class="btn-secondary" href="${gameUrl}" target="_blank" rel="noopener">Open Game</a>
                   </div>`
                : ""
        }
    `;
}

// --- Stockfish engine ----------------------------------------------------

const ENGINE_URL = "https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js";
const ENGINE_DEPTH = 18;
const MULTI_PV = 3;
let engineEnabled = true;

let engine = null;
let engineReady = false;
let engineQueue = [];
let activeEvalCallback = null;
let enginePromise = null;

async function buildEngineWorker() {
    // Workers cannot be loaded from cross-origin URLs directly. Fetch the
    // script and wrap it in a blob URL so it's same-origin from the browser's
    // perspective. The script uses importScripts() internally for the .wasm
    // file; we keep that working by injecting a base path via a tiny shim.
    const res = await fetch(ENGINE_URL);
    if (!res.ok) throw new Error(`Could not fetch Stockfish: ${res.status}`);
    const code = await res.text();
    const baseUrl = ENGINE_URL.substring(0, ENGINE_URL.lastIndexOf("/") + 1);
    const shim = `self.importScripts = (function(orig){
        return function(...urls){
            return orig.apply(self, urls.map(u => new URL(u, ${JSON.stringify(baseUrl)}).toString()));
        };
    })(self.importScripts);\n`;
    const blob = new Blob([shim + code], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
}

async function ensureEngine() {
    if (engine) return engine;
    if (enginePromise) return enginePromise;

    enginePromise = (async () => {
        const w = await buildEngineWorker();
        w.onmessage = (e) => {
            const line = typeof e.data === "string" ? e.data : "";
            if (line === "uciok") {
                w.postMessage(`setoption name MultiPV value ${MULTI_PV}`);
                w.postMessage("isready");
            } else if (line === "readyok") {
                engineReady = true;
                while (engineQueue.length) w.postMessage(engineQueue.shift());
            } else if (line.startsWith("info ") && activeEvalCallback) {
                activeEvalCallback({ kind: "info", line });
            } else if (line.startsWith("bestmove") && activeEvalCallback) {
                activeEvalCallback({ kind: "bestmove", line });
            }
        };
        w.postMessage("uci");
        engine = w;
        return w;
    })();

    return enginePromise;
}

function sendEngine(cmd) {
    if (engine && engineReady) {
        engine.postMessage(cmd);
    } else {
        engineQueue.push(cmd);
        ensureEngine();
    }
}

function parseInfoLine(line) {
    // Parse a UCI 'info ...' line into { depth, multipv, scoreCp, scoreMate, pv }
    const out = { multipv: 1 };
    const tokens = line.split(/\s+/);
    for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        if (t === "depth") out.depth = parseInt(tokens[++i], 10);
        else if (t === "multipv") out.multipv = parseInt(tokens[++i], 10);
        else if (t === "score") {
            const type = tokens[++i];
            const val = parseInt(tokens[++i], 10);
            if (type === "cp") out.scoreCp = val;
            else if (type === "mate") out.scoreMate = val;
        } else if (t === "pv") {
            out.pv = tokens.slice(i + 1).join(" ");
            break;
        }
    }
    return out;
}

let evalToken = 0;
function evaluatePosition(fen, sideToMove, onUpdate) {
    const myToken = ++evalToken;

    sendEngine("stop");
    sendEngine("position fen " + fen);

    activeEvalCallback = (msg) => {
        if (myToken !== evalToken) return;
        if (msg.kind === "info") {
            const info = parseInfoLine(msg.line);
            if (info.depth) onUpdate({ ...info, sideToMove });
        } else if (msg.kind === "bestmove") {
            onUpdate({ done: true, sideToMove });
        }
    };

    sendEngine(`go depth ${ENGINE_DEPTH}`);
}

// --- Analysis board ------------------------------------------------------

let board = null;
let chessForBoard = null; // chess.js instance representing CURRENT displayed position
let positions = []; // [{ fen, sanMove, lastMove: [from, to] }, ...] including initial
let plyIndex = 0;

function buildPositionsFromPgn(pgn) {
    const c = new Chess();
    if (!c.loadPgn(pgn, { sloppy: true })) {
        // chess.js v1 throws or returns nothing; fall back to empty
    }
    const history = c.history({ verbose: true });
    const replay = new Chess();
    const out = [{ fen: replay.fen(), sanMove: null, lastMove: null }];
    for (const move of history) {
        const made = replay.move({ from: move.from, to: move.to, promotion: move.promotion });
        if (!made) break;
        out.push({ fen: replay.fen(), sanMove: made.san, lastMove: [move.from, move.to] });
    }
    return out;
}

function updateEvalBar(scoreCp, scoreMate, sideToMove) {
    const fill = document.querySelector(".eval-bar-fill");
    const top = document.querySelector(".eval-bar-label.top");
    const bot = document.querySelector(".eval-bar-label.bottom");
    if (!fill) return;

    let whiteScore;
    let label;
    if (scoreMate !== undefined && scoreMate !== null) {
        const mateForSideToMove = scoreMate;
        const mateForWhite = sideToMove === "w" ? mateForSideToMove : -mateForSideToMove;
        whiteScore = mateForWhite > 0 ? 2000 : -2000;
        label = `M${Math.abs(mateForSideToMove)}`;
    } else if (scoreCp !== undefined && scoreCp !== null) {
        const cpForWhite = sideToMove === "w" ? scoreCp : -scoreCp;
        whiteScore = cpForWhite;
        label = (cpForWhite / 100).toFixed(2);
        if (cpForWhite >= 0) label = "+" + label;
    } else {
        return;
    }

    // Map [-1000, +1000] cp to [10%, 90%] fill (white at bottom)
    const clamped = Math.max(-1000, Math.min(1000, whiteScore));
    const pct = 50 + (clamped / 1000) * 40;
    fill.style.height = `${pct}%`;

    // Show label on the side that's winning
    if (whiteScore >= 0) {
        bot.textContent = label;
        bot.style.display = "block";
        top.style.display = "none";
    } else {
        top.textContent = label;
        top.style.display = "block";
        bot.style.display = "none";
    }
}

function formatEval(scoreCp, scoreMate, sideToMove) {
    if (scoreMate !== undefined && scoreMate !== null) {
        const mateForWhite = sideToMove === "w" ? scoreMate : -scoreMate;
        return mateForWhite >= 0 ? `M${Math.abs(scoreMate)}` : `-M${Math.abs(scoreMate)}`;
    }
    if (scoreCp !== undefined && scoreCp !== null) {
        const cpForWhite = sideToMove === "w" ? scoreCp : -scoreCp;
        const v = (cpForWhite / 100).toFixed(2);
        return cpForWhite >= 0 ? `+${v}` : v;
    }
    return "—";
}

function updateEngineReadout(lines, depth, sideToMove, fen) {
    const el = document.querySelector(".engine-readout");
    if (!el) return;
    el.classList.remove("loading");

    const headerLine = lines[1] || lines[2] || lines[3];
    const headerEval = headerLine
        ? formatEval(headerLine.scoreCp, headerLine.scoreMate, sideToMove)
        : "—";

    const rows = [];
    for (let i = 1; i <= MULTI_PV; i++) {
        const ln = lines[i];
        if (!ln) {
            rows.push(`<div class="pv-row"><span class="pv-eval">—</span><span class="pv-line"></span></div>`);
            continue;
        }
        const ev = formatEval(ln.scoreCp, ln.scoreMate, sideToMove);
        const pv = ln.pv ? convertPvToSan(ln.pv, fen) : "";
        rows.push(
            `<div class="pv-row"><span class="pv-eval">${escapeHtml(ev)}</span><span class="pv-line">${escapeHtml(pv)}</span></div>`,
        );
    }

    el.innerHTML = `
        <div class="engine-header">
            <span class="eval-num">${escapeHtml(headerEval)}</span>
            <span class="eval-depth">depth ${depth ?? "—"}</span>
        </div>
        <div class="pv-list">${rows.join("")}</div>
    `;
}

function convertPvToSan(uciPv, startFen) {
    try {
        const c = new Chess(startFen);
        const moves = uciPv.trim().split(/\s+/);
        const sanMoves = [];
        for (const uci of moves) {
            const from = uci.slice(0, 2);
            const to = uci.slice(2, 4);
            const promotion = uci.length > 4 ? uci[4] : undefined;
            const m = c.move({ from, to, promotion });
            if (!m) break;
            sanMoves.push(m.san);
            if (sanMoves.length >= 8) break;
        }
        // Format with move numbers
        const formatted = [];
        const fenParts = startFen.split(" ");
        let moveNum = parseInt(fenParts[5], 10) || 1;
        let isWhiteToMove = fenParts[1] === "w";
        for (const san of sanMoves) {
            if (isWhiteToMove) formatted.push(`${moveNum}. ${san}`);
            else if (formatted.length === 0) formatted.push(`${moveNum}...${san}`);
            else formatted.push(san);
            if (!isWhiteToMove) moveNum++;
            isWhiteToMove = !isWhiteToMove;
        }
        return formatted.join(" ");
    } catch {
        return uciPv;
    }
}

function highlightActiveMove() {
    const moves = document.querySelectorAll(".move-list .move");
    moves.forEach((el) => {
        const idx = parseInt(el.dataset.ply, 10);
        if (idx === plyIndex) el.classList.add("active");
        else el.classList.remove("active");
    });
    const active = document.querySelector(".move-list .move.active");
    if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function gotoPly(idx) {
    if (idx < 0 || idx >= positions.length) return;
    plyIndex = idx;
    const pos = positions[idx];
    chessForBoard = new Chess(pos.fen);
    const sideToMove = pos.fen.split(" ")[1];
    if (board) {
        board.set({
            fen: pos.fen,
            turnColor: sideToMove === "w" ? "white" : "black",
            lastMove: pos.lastMove || undefined,
            check: chessForBoard.isCheck(),
        });
    }
    highlightActiveMove();

    if (!engineEnabled) return;

    // Reset readout, then stream multi-line updates per depth.
    const el = document.querySelector(".engine-readout");
    if (el) {
        el.classList.add("loading");
        el.innerHTML = `<div class="engine-header"><span class="eval-num">…</span><span class="eval-depth">analyzing</span></div><div class="pv-list"></div>`;
    }

    const lines = {}; // { 1: {scoreCp/Mate, pv}, 2: {...}, 3: {...} }
    let currentDepth = 0;

    evaluatePosition(pos.fen, sideToMove, (info) => {
        if (info.done) return;
        if (!info.depth) return;
        // When depth advances, clear stale lines so we only show one depth's set at a time.
        if (info.depth > currentDepth) {
            currentDepth = info.depth;
            for (const k of Object.keys(lines)) delete lines[k];
        } else if (info.depth < currentDepth) {
            return; // stale info from prior depth, ignore
        }
        lines[info.multipv || 1] = {
            scoreCp: info.scoreCp,
            scoreMate: info.scoreMate,
            pv: info.pv,
        };
        // Eval bar tracks the best line (multipv 1).
        const best = lines[1];
        if (best) updateEvalBar(best.scoreCp, best.scoreMate, sideToMove);
        updateEngineReadout(lines, currentDepth, sideToMove, pos.fen);
    });
}

function renderMoveList() {
    const ml = document.querySelector(".move-list");
    if (!ml) return;
    const parts = [];
    for (let i = 1; i < positions.length; i++) {
        const ply = i;
        const fullMoveNum = Math.ceil(ply / 2);
        const isWhite = ply % 2 === 1;
        if (isWhite) parts.push(`<span class="move-num">${fullMoveNum}.</span>`);
        parts.push(
            `<span class="move" data-ply="${ply}">${escapeHtml(positions[i].sanMove || "?")}</span>`,
        );
    }
    ml.innerHTML = parts.join(" ");
    ml.querySelectorAll(".move").forEach((el) => {
        el.addEventListener("click", () => gotoPly(parseInt(el.dataset.ply, 10)));
    });
}

function renderAnalysis(pgn) {
    positions = buildPositionsFromPgn(pgn);
    plyIndex = 0;

    gameViewer.classList.remove("empty");
    gameViewer.innerHTML = `
        <div class="analysis">
            <div class="board-wrapper" id="boardEl"></div>
            <div class="eval-bar">
                <span class="eval-bar-label top"></span>
                <div class="eval-bar-fill"></div>
                <span class="eval-bar-label bottom">0.00</span>
            </div>
            <div class="analysis-side">
                <div class="engine-readout loading">
                    <span class="eval-num">…</span>
                    <span class="eval-depth">starting engine</span>
                    <div class="pv"></div>
                </div>
                <div class="viewer-controls">
                    <button class="btn-first" title="First (Home)">⏮</button>
                    <button class="btn-prev" title="Previous (←)">◀</button>
                    <button class="btn-next" title="Next (→)">▶</button>
                    <button class="btn-last" title="Last (End)">⏭</button>
                    <button class="btn-flip" title="Flip board">⇅</button>
                    <button class="btn-engine" title="Toggle engine">🧠</button>
                </div>
                <div class="move-list"></div>
            </div>
        </div>
    `;

    const boardEl = document.getElementById("boardEl");
    board = Chessground(boardEl, {
        fen: positions[0].fen,
        viewOnly: true,
        coordinates: true,
        animation: { enabled: true, duration: 200 },
    });

    renderMoveList();

    document.querySelector(".btn-first").addEventListener("click", () => gotoPly(0));
    document.querySelector(".btn-prev").addEventListener("click", () => gotoPly(plyIndex - 1));
    document.querySelector(".btn-next").addEventListener("click", () => gotoPly(plyIndex + 1));
    document.querySelector(".btn-last").addEventListener("click", () => gotoPly(positions.length - 1));
    document.querySelector(".btn-flip").addEventListener("click", () => board.toggleOrientation());
    document.querySelector(".btn-engine").addEventListener("click", toggleEngine);

    applyEngineVisibility();
    if (engineEnabled) ensureEngine();
    gotoPly(0);
}

function applyEngineVisibility() {
    const analysis = document.querySelector(".analysis");
    const btn = document.querySelector(".btn-engine");
    if (analysis) analysis.classList.toggle("engine-off", !engineEnabled);
    if (btn) btn.classList.toggle("active", engineEnabled);
}

function toggleEngine() {
    engineEnabled = !engineEnabled;
    applyEngineVisibility();
    if (engineEnabled) {
        ensureEngine();
        gotoPly(plyIndex);
    } else {
        // Stop any in-flight analysis so the worker idles.
        evalToken++;
        sendEngine("stop");
    }
}

document.addEventListener("keydown", (e) => {
    if (!positions.length) return;
    if (e.target.matches("input, select, textarea")) return;
    if (e.key === "ArrowLeft") {
        e.preventDefault();
        gotoPly(plyIndex - 1);
    } else if (e.key === "ArrowRight") {
        e.preventDefault();
        gotoPly(plyIndex + 1);
    } else if (e.key === "Home") {
        gotoPly(0);
    } else if (e.key === "End") {
        gotoPly(positions.length - 1);
    }
});

// --- Click handler -------------------------------------------------------

randomBtn.addEventListener("click", async () => {
    const playerId = playerSelect.value;
    const player = PLAYERS.find((p) => p.id === playerId);
    if (!player) {
        showError("Unknown player.");
        return;
    }
    const maxGames = parseInt(maxGamesInput.value, 10) || 100;

    randomBtn.disabled = true;
    showLoading(`Loading ${player.label}'s games…`);

    try {
        const pgnPool = await loadBundledGames(player, maxGames);

        if (!pgnPool.length) {
            showError(`No games available for ${player.label}.`);
            return;
        }

        const pickedPgn = pgnPool[Math.floor(Math.random() * pgnPool.length)];
        const headers = parsePgnHeaders(pickedPgn);
        const movesText = extractMoves(pickedPgn);

        // Render the analysis board immediately — engine eval starts right away.
        renderAnalysis(pickedPgn);

        // Kick off Lichess import in the background; update the sidebar info either way.
        renderSidebarInfo({ headers, movesText, lichess: null });
        importPgnToLichess(pickedPgn)
            .then((lichess) => renderSidebarInfo({ headers, movesText, lichess }))
            .catch((err) => {
                console.warn("Import failed:", err);
            });
    } catch (err) {
        console.error(err);
        showError(err.message);
    } finally {
        randomBtn.disabled = false;
    }
});

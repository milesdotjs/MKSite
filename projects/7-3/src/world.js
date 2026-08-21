/* ============================================================
   7-3 — the city

   Areas are generated on demand and cached. Every area is built
   with at least two doors, and a door is linked to its destination
   the first time it is used, so the map grows outward forever and
   can never present a dead end: the way you came in is always a
   way out, and there is always at least one door you have not
   taken yet.

   Generation is seeded per area, so the same save always rebuilds
   the same city.
   ============================================================ */

import { TILE, tileById } from './tiles.js';
import { RNG, hash } from './rng.js';
import { CAST } from './content.js';
import { interactionsFor } from './interactions.js';
import { pickVoice } from './voices.js';

export const SCREEN_TW = 20; // tiles across a 160px screen
export const SCREEN_TH = 18;

/* ---------- area kinds ---------- */

export const KINDS = {
  apartment: { title: 'APARTMENT', pal: 'home', indoor: true, w: 20, h: 18 },
  street: { title: 'STREET', pal: 'street', indoor: false, w: 32, h: 18 },
  station: { title: 'STATION', pal: 'street', indoor: false, w: 26, h: 18 },
  office_lobby: { title: 'LOBBY', pal: 'office', indoor: true, w: 20, h: 18 },
  office_floor: { title: 'FLOOR', pal: 'office', indoor: true, w: 24, h: 18 },
  break_room: { title: 'BREAK ROOM', pal: 'office', indoor: true, w: 20, h: 18 },
  meeting_room: { title: 'MEETING ROOM', pal: 'office', indoor: true, w: 20, h: 18 },
  market: { title: 'SUPERMARKET', pal: 'market', indoor: true, w: 24, h: 18 },
  konbini: { title: 'CONVENIENCE STORE', pal: 'market', indoor: true, w: 20, h: 18 },
  park: { title: 'PARK', pal: 'street', indoor: false, w: 26, h: 18 },
  izakaya: { title: 'IZAKAYA', pal: 'warm', indoor: true, w: 20, h: 18 },
  arcade: { title: 'GAME CENTRE', pal: 'alert', indoor: true, w: 22, h: 18 },
};

/** What each area kind can lead to, and how likely. */
const LINKS = {
  apartment: [['street', 1]],
  street: [
    ['street', 3],
    ['office_lobby', 2],
    ['konbini', 2],
    ['market', 1.5],
    ['park', 1.5],
    ['izakaya', 1.2],
    ['station', 1.2],
    ['arcade', 1.4],
    ['apartment', 0.8],
  ],
  arcade: [
    ['street', 2],
    ['konbini', 0.8],
  ],
  station: [
    ['street', 3],
    ['office_lobby', 2],
    ['konbini', 1],
  ],
  office_lobby: [
    ['office_floor', 3],
    ['street', 1.5],
  ],
  office_floor: [
    ['office_floor', 2],
    ['break_room', 2],
    ['meeting_room', 2],
    ['office_lobby', 1.5],
  ],
  break_room: [
    ['office_floor', 3],
    ['meeting_room', 1],
  ],
  meeting_room: [
    ['office_floor', 3],
    ['break_room', 1],
  ],
  market: [['street', 2]],
  konbini: [['street', 2]],
  park: [
    ['street', 2],
    ['park', 0.6],
  ],
  izakaya: [['street', 2]],
};

const STREET_NAMES = [
  'KITA', 'MINAMI', 'HIGASHI', 'NISHI', 'SAKURA', 'AOBA', 'HONMACHI',
  'NAKAMICHI', 'TSUKI', 'HIKARI', 'MIDORI', 'YANAGI',
];
const FLOOR_SUFFIX = ['2F', '3F', '4F', '5F', '6F', '7F', '8F', '9F', '11F', '12F'];

/* ---------- grid helpers ---------- */

const idx = (a, x, y) => y * a.w + x;

/** The four orthogonal neighbours, for adjacency tests. */
const STEPS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

/**
 * Every tile genuinely walkable from the entrance, as "x,y" keys.
 * Used to guarantee that nothing placed in a room is stranded behind
 * furniture — an open tile is not the same as a reachable one.
 */
function walkableFrom(a) {
  const seen = new Set();
  const start = a.doors[0];
  if (!start) return seen;
  const key = (x, y) => `${x},${y}`;
  const q = [[start.inX, start.inY]];
  seen.add(key(start.inX, start.inY));
  while (q.length) {
    const [x, y] = q.pop();
    for (const [dx, dy] of STEPS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= a.w || ny >= a.h) continue;
      const k = key(nx, ny);
      if (seen.has(k)) continue;
      if (tileById(tileIdAt(a, nx, ny)).solid) continue;
      seen.add(k);
      q.push([nx, ny]);
    }
  }
  return seen;
}

export function tileIdAt(a, x, y) {
  if (x < 0 || y < 0 || x >= a.w || y >= a.h) return TILE.VOID.id;
  return a.tiles[idx(a, x, y)];
}

function set(a, x, y, t) {
  if (x < 0 || y < 0 || x >= a.w || y >= a.h) return;
  a.tiles[idx(a, x, y)] = t.id;
}

function fill(a, x0, y0, w, h, t) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) set(a, x, y, t);
}

function blank(kind, id, name, seed) {
  const k = KINDS[kind];
  const a = {
    id,
    kind,
    name,
    pal: k.pal,
    indoor: k.indoor,
    w: k.w,
    h: k.h,
    tiles: new Uint8Array(k.w * k.h).fill(TILE.FLOOR.id),
    doors: [],
    npcs: [],
    props: [],
    seed,
  };
  return a;
}

/** Walls around the outside, with the back wall taller. */
function walls(a) {
  fill(a, 0, 0, a.w, 2, TILE.WALL_TOP);
  fill(a, 0, a.h - 1, a.w, 1, TILE.WALL);
  fill(a, 0, 0, 1, a.h, TILE.WALL);
  fill(a, a.w - 1, 0, 1, a.h, TILE.WALL);
}

/**
 * Doors are placed on the bottom edge and on the side edges, always
 * with a clear floor tile inboard so the player can never be sealed in.
 */
const SIGN = {
  street: 'STREET', station: 'STATION', office_lobby: 'OFFICE', office_floor: 'OFFICE',
  break_room: 'BREAK', meeting_room: 'MEETING', market: 'MARKET', konbini: 'STORE',
  park: 'PARK', izakaya: 'IZAKAYA', apartment: 'HOME', arcade: 'ARCADE',
};

/**
 * Doors are 16px on their long axis so they read at the same scale as
 * the character standing in front of them. A door in a horizontal wall
 * is 2x2 and occupies (x,y)..(x+1,y+1); a door in a side wall is 1x2.
 * Every tile of the door triggers the transition.
 */
function addDoor(a, x, y, kind, label, face = 'down') {
  const vertical = face === 'left' || face === 'right';
  const tiles = vertical
    ? [
        [x, y, TILE.DOOR_VT],
        [x, y + 1, TILE.DOOR_VB],
      ]
    : [
        [x, y, TILE.DOOR_TL],
        [x + 1, y, TILE.DOOR_TR],
        [x, y + 1, TILE.DOOR_BL],
        [x + 1, y + 1, TILE.DOOR_BR],
      ];
  for (const [tx, ty, tile] of tiles) set(a, tx, ty, tile);
  a.doors.push({
    x, y, kind, face,
    vertical,
    tiles: tiles.map(([tx, ty]) => [tx, ty]),
    label: label || KINDS[kind].title,
    sign: SIGN[kind] || KINDS[kind].title,
    toId: null,
    toDoor: -1,
  });
}

/** Is (x,y) part of this door? */
const doorCovers = (d, x, y) => d.tiles.some(([tx, ty]) => tx === x && ty === y);

/** Tiles that only make sense as part of a wall, never free-standing. */
const WALL_ONLY = new Set(['WALL', 'WALL_TOP', 'FACADE', 'WINDOW', 'AWNING', 'ROAD', 'CURB']);

/** Can you still walk from the first door's apron to every other one? */
function allDoorsConnected(a) {
  if (a.doors.length < 2) return true;
  const seen = walkableFrom(a);
  return a.doors.every((d) => seen.has(`${d.inX},${d.inY}`));
}

/* ---------- decoration helpers ---------- */

function patch(a, rng, tile, tries, sizeMin, sizeMax) {
  for (let i = 0; i < tries; i++) {
    const w = rng.int(sizeMin, sizeMax);
    const h = rng.int(sizeMin, sizeMax);
    const x = rng.int(2, Math.max(2, a.w - w - 2));
    const y = rng.int(3, Math.max(3, a.h - h - 3));
    fill(a, x, y, w, h, tile);
  }
}

/**
 * Clear, walkable tiles with nothing already on them.
 *
 * This used to test for FLOOR or CARPET specifically, which quietly
 * meant nothing could ever be placed outdoors — pavement, road and
 * grass are none of those — so streets and parks generated with no
 * people in them at all. Test what actually matters instead: can you
 * stand here, and is the square free.
 */
function freeSpots(a, rng, n, avoid = 2) {
  const out = [];
  const taken = (x, y) =>
    a.doors.some((d) => doorCovers(d, x, y) || (d.inX === x && d.inY === y)) ||
    a.npcs.some((p) => p.x === x && p.y === y) ||
    a.props.some((p) => p.x === x && p.y === y);
  let guard = 0;
  while (out.length < n && guard++ < 500) {
    const x = rng.int(2, a.w - 3);
    const y = rng.int(3, a.h - 3);
    if (tileById(tileIdAt(a, x, y)).solid) continue;
    if (taken(x, y)) continue;
    if (out.some((p) => Math.abs(p.x - x) < avoid && Math.abs(p.y - y) < avoid)) continue;
    out.push({ x, y });
  }
  return out;
}

/* ---------- generators ---------- */

function genOfficeFloor(a, rng) {
  walls(a);
  // carpet blocks are the encounter zones
  patch(a, rng, TILE.CARPET, rng.int(3, 5), 3, 7);
  // desk banks
  const banks = rng.int(2, 4);
  for (let i = 0; i < banks; i++) {
    const bw = rng.int(2, 4);
    const x = rng.int(2, a.w - bw - 3);
    const y = rng.int(3, a.h - 6);
    for (let k = 0; k < bw; k++) {
      set(a, x + k, y, TILE.DESK);
      set(a, x + k, y + 1, TILE.CHAIR);
    }
  }
  for (const p of freeSpots(a, rng, rng.int(1, 3))) set(a, p.x, p.y, TILE.PLANT);
  // the equipment an office actually has, all of it interactable
  const KIT = [TILE.PRINTER, TILE.COOLER, TILE.COMPUTER, TILE.FAX, TILE.COPIER,
               TILE.CABINET, TILE.SHREDDER, TILE.SERVER, TILE.NOTICEBOARD];
  for (const t of rng.shuffle(KIT).slice(0, rng.int(4, 6))) {
    const spot = freeSpots(a, rng, 1)[0];
    if (spot) set(a, spot.x, spot.y, t);
  }
  return { encounter: 1 };
}

function genBreakRoom(a, rng) {
  walls(a);
  fill(a, 2, 2, a.w - 4, 2, TILE.COUNTER);
  set(a, 3, 4, TILE.COOLER);
  set(a, a.w - 4, 4, TILE.VENDING);
  const tables = rng.int(2, 3);
  for (let i = 0; i < tables; i++) {
    const x = rng.int(3, a.w - 5);
    const y = rng.int(7, a.h - 4);
    set(a, x, y, TILE.TABLE);
    set(a, x - 1, y, TILE.CHAIR);
    set(a, x + 1, y, TILE.CHAIR);
  }
  patch(a, rng, TILE.CARPET, 1, 3, 5);
  for (const t of [TILE.MICROWAVE, TILE.NOTICEBOARD]) {
    const spot = freeSpots(a, rng, 1)[0];
    if (spot) set(a, spot.x, spot.y, t);
  }
  a.props.push({ type: 'shop', shop: 'break_room', x: 4, y: 4 });
  addFoodStall(a, rng, 1);
  return { encounter: 0.6 };
}

function genMeetingRoom(a, rng) {
  walls(a);
  fill(a, 3, 2, a.w - 6, 1, TILE.WHITEBOARD);
  const tx = 4;
  const ty = 6;
  const tw = a.w - 8;
  fill(a, tx, ty, tw, 3, TILE.TABLE);
  for (let x = tx; x < tx + tw; x++) {
    set(a, x, ty - 1, TILE.CHAIR);
    set(a, x, ty + 3, TILE.CHAIR);
  }
  const nb = freeSpots(a, rng, 1)[0];
  if (nb) set(a, nb.x, nb.y, TILE.NOTICEBOARD);
  // at the end of the table, not the middle of it: the centre is
  // ringed by chairs and could never be walked up to
  a.props.push({ type: 'speakerphone', x: tx, y: ty + 1 });
  return { encounter: 1.3 };
}

function genLobby(a, rng) {
  walls(a);
  fill(a, 3, 3, a.w - 6, 2, TILE.COUNTER);
  for (const p of freeSpots(a, rng, 4)) set(a, p.x, p.y, TILE.PLANT);
  fill(a, 6, a.h - 6, a.w - 12, 3, TILE.FLOOR_TILE);
  patch(a, rng, TILE.CARPET, 1, 3, 4);
  return { encounter: 0.5 };
}

function genMarket(a, rng) {
  walls(a);
  // aisles of shelving with produce between them
  for (let x = 3; x < a.w - 3; x += 4) {
    const top = rng.int(4, 5);
    const bot = a.h - rng.int(4, 6);
    for (let y = top; y < bot; y++) set(a, x, y, TILE.SHELF);
  }
  patch(a, rng, TILE.PRODUCE, rng.int(2, 4), 2, 4);
  fill(a, 2, 2, a.w - 4, 1, TILE.FREEZER);
  fill(a, 3, a.h - 3, a.w - 8, 1, TILE.COUNTER);
  a.props.push({ type: 'shop', shop: 'market', x: 4, y: a.h - 3 });
  a.npcs.push({ x: 4, y: a.h - 4, kind: 'clerk', castId: null, facing: 'down', shop: 'market' });
  return { encounter: 1 };
}

function genKonbini(a, rng) {
  walls(a);
  for (let x = 3; x < a.w - 4; x += 3) fill(a, x, 4, 1, a.h - 9, TILE.SHELF);
  fill(a, 2, 2, a.w - 4, 1, TILE.FREEZER);
  fill(a, 3, a.h - 4, 6, 1, TILE.COUNTER);
  patch(a, rng, TILE.PRODUCE, 1, 2, 3);
  a.props.push({ type: 'shop', shop: 'konbini', x: 4, y: a.h - 4 });
  addFoodStall(a, rng, 1);
  if (rng.chance(0.75)) addLoneCabinet(a, rng);
  a.npcs.push({ x: 4, y: a.h - 5, kind: 'clerk', castId: null, facing: 'down', shop: 'konbini' });
  return { encounter: 0.7 };
}

/**
 * Grass first, then paths cut through it — the other way round paved
 * the whole park and tiled the pavement seam into graph paper.
 */
function genPark(a, rng) {
  fill(a, 0, 0, a.w, a.h, TILE.GRASS);
  const py = rng.int(6, a.h - 6);
  fill(a, 0, py, a.w, 2, TILE.SIDEWALK);
  const px = rng.int(5, a.w - 7);
  fill(a, px, 0, 2, a.h, TILE.SIDEWALK);
  for (const p of freeSpots(a, rng, rng.int(6, 10), 3)) set(a, p.x, p.y, TILE.TREE);
  for (const p of freeSpots(a, rng, rng.int(2, 3), 4)) set(a, p.x, p.y, TILE.BENCH);
  for (const p of freeSpots(a, rng, 2, 5)) set(a, p.x, p.y, TILE.LAMP);
  addFoodStall(a, rng, 1);
  if (rng.chance(0.3)) addLoneCabinet(a, rng);
  return { encounter: 0.5 };
}

function genIzakaya(a, rng) {
  walls(a);
  fill(a, 2, 3, a.w - 4, 2, TILE.COUNTER);
  for (let x = 3; x < a.w - 3; x += 2) set(a, x, 5, TILE.BAR_STOOL);
  set(a, 2, 2, TILE.LANTERN);
  set(a, a.w - 3, 2, TILE.LANTERN);
  const tables = rng.int(2, 3);
  for (let i = 0; i < tables; i++) {
    const x = rng.int(3, a.w - 5);
    const y = rng.int(8, a.h - 4);
    set(a, x, y, TILE.TABLE);
    set(a, x - 1, y, TILE.BAR_STOOL);
    set(a, x + 1, y, TILE.BAR_STOOL);
  }
  a.props.push({ type: 'drink', x: 4, y: 5 });
  if (rng.chance(0.65)) addLoneCabinet(a, rng);
  return { encounter: 0.5 };
}

function genApartment(a, rng) {
  walls(a);
  set(a, 2, 3, TILE.BED);
  set(a, 3, 3, TILE.BED);
  set(a, 2, 4, TILE.BED);
  set(a, 3, 4, TILE.BED);
  set(a, a.w - 4, 3, TILE.TV);
  fill(a, a.w - 8, 6, 4, 3, TILE.RUG);
  set(a, 6, 3, TILE.TABLE);
  set(a, 6, 4, TILE.CHAIR);
  for (const p of freeSpots(a, rng, 2)) set(a, p.x, p.y, TILE.PLANT);
  a.props.push({ type: 'bed', x: 2, y: 4 });
  return { encounter: 0 };
}

function genStreet(a, rng) {
  const roadY = a.h - 5;
  fill(a, 0, 0, a.w, a.h, TILE.SIDEWALK);

  // roofline, facade, shopfront
  fill(a, 0, 0, a.w, 2, TILE.WALL_TOP);
  fill(a, 0, 2, a.w, 4, TILE.FACADE);
  for (let x = 1; x < a.w - 1; x++) {
    if (rng.chance(0.55)) set(a, x, 3, TILE.WINDOW);
    if (rng.chance(0.3)) set(a, x, 2, TILE.WINDOW);
  }
  // awnings over stretches of the shopfront
  for (let x = 1; x < a.w - 2; x += rng.int(4, 7)) {
    const w = rng.int(2, 4);
    fill(a, x, 4, Math.min(w, a.w - 1 - x), 1, TILE.AWNING);
  }

  // the road, which is scenery
  fill(a, 0, roadY, a.w, 1, TILE.CURB);
  fill(a, 0, roadY + 1, a.w, a.h - roadY - 1, TILE.ROAD);
  for (let x = 1; x < a.w; x += 4) set(a, x, roadY + 2, TILE.ROAD_LINE);
  const cross = rng.int(3, a.w - 6);
  for (let y = roadY; y < a.h; y++) {
    set(a, cross, y, TILE.CROSSWALK);
    set(a, cross + 1, y, TILE.CROSSWALK);
  }

  // street furniture, kept off the row directly under the doors
  for (let x = 3; x < a.w - 2; x += rng.int(5, 8)) set(a, x, roadY - 1, TILE.LAMP);
  for (let i = 0; i < rng.int(2, 4); i++) {
    const x = rng.int(2, a.w - 3);
    const y = rng.int(8, roadY - 1);
    if (tileIdAt(a, x, y) !== TILE.SIDEWALK.id) continue;
    set(a, x, y, rng.pick([TILE.TREE, TILE.VENDING, TILE.BENCH, TILE.PLANT]));
  }
  if (rng.chance(0.6)) addFoodStall(a, rng, 1);
  return { encounter: 1 };
}

/**
 * The game centre: rows of cabinets you feed money into. This is the
 * main money sink, and the only place where spending can pay you back.
 */
function genArcade(a, rng) {
  walls(a);
  fill(a, 1, 2, a.w - 2, a.h - 3, TILE.ARCADE_FLOOR);
  // banks of cabinets, back to back, with aisles between
  for (let y = 4; y < a.h - 4; y += 4) {
    for (let x = 3; x < a.w - 3; x++) {
      if (rng.chance(0.72)) set(a, x, y, rng.chance(0.22) ? TILE.CABINET_CLAW : TILE.CABINET_ARCADE);
    }
  }
  // a change counter and a drinks machine
  set(a, 2, 2, TILE.VENDING);
  fill(a, a.w - 6, 2, 4, 1, TILE.COUNTER);

  const cabinets = [];
  for (let y = 0; y < a.h; y++) {
    for (let x = 0; x < a.w; x++) {
      const id = a.tiles[idx(a, x, y)];
      if (id === TILE.CABINET_ARCADE.id || id === TILE.CABINET_CLAW.id) cabinets.push({ x, y });
    }
  }
  for (const c of rng.shuffle(cabinets).slice(0, rng.int(3, 5))) {
    a.props.push({ type: 'arcade', x: c.x, y: c.y, claw: a.tiles[idx(a, c.x, c.y)] === TILE.CABINET_CLAW.id });
  }
  return { encounter: 0.25 };
}

/**
 * A single cabinet tucked into a corner. Convenience stores and bars
 * really do have one, and it means you meet the money sink without
 * having to find the game centre first.
 */
function addLoneCabinet(a, rng) {
  const spot = freeSpots(a, rng, 1, 3)[0];
  if (!spot) return;
  const claw = rng.chance(0.5);
  set(a, spot.x, spot.y, claw ? TILE.CABINET_CLAW : TILE.CABINET_ARCADE);
  a.props.push({ type: 'arcade', x: spot.x, y: spot.y, claw });
}

/** Somewhere to buy something you do not need. */
function addFoodStall(a, rng, n = 1) {
  for (const p of freeSpots(a, rng, n, 4)) {
    set(a, p.x, p.y, TILE.FOOD_STALL);
    a.props.push({ type: 'vendor', x: p.x, y: p.y });
  }
}

const GENERATORS = {
  apartment: genApartment,
  street: genStreet,
  station: genStreet,
  office_lobby: genLobby,
  office_floor: genOfficeFloor,
  break_room: genBreakRoom,
  meeting_room: genMeetingRoom,
  market: genMarket,
  konbini: genKonbini,
  park: genPark,
  izakaya: genIzakaya,
  arcade: genArcade,
};

/* ---------- doors ---------- */

/**
 * Give an area its doors. Interiors get one on the bottom wall plus
 * one or two on the sides; streets get doors punched into the
 * building fronts. Always at least two, so nothing is ever a
 * dead end.
 */
function placeDoors(a, rng, entranceKind) {
  const options = LINKS[a.kind] || [['street', 1]];
  const pick = () => rng.weighted(options.map(([kind, weight]) => ({ kind, weight }))).kind;

  if (a.kind === 'street' || a.kind === 'station') {
    /*
     * Shopfronts, spaced so the signs do not collide. Destinations are
     * drawn without replacement — three doors that all say STREET is a
     * block nobody can navigate — and roughly half of all streets are
     * guaranteed an office, so the commute is always findable.
     */
    const n = rng.int(3, 4);
    const spacing = Math.floor((a.w - 4) / n);
    const pool = options.filter(([k]) => k !== 'street').map(([kind, weight]) => ({ kind, weight }));
    const kinds = [];
    if (rng.chance(0.7)) kinds.push('office_lobby');
    while (kinds.length < n && pool.length) {
      const avail = pool.filter((o) => !kinds.includes(o.kind));
      if (!avail.length) break;
      kinds.push(rng.weighted(avail).kind);
    }
    while (kinds.length < n) kinds.push('street');
    for (let i = 0; i < n; i++) {
      const x = 3 + i * spacing + rng.int(0, Math.max(0, spacing - 5));
      // 2x2, sitting in the bottom two rows of the shopfront
      addDoor(a, Math.min(a.w - 4, x), 4, kinds[i], null, 'down');
    }
    // and the street continues both ways
    const walkY = a.h - 9;
    addDoor(a, 0, walkY, 'street', 'WEST', 'right');
    addDoor(a, a.w - 1, walkY, 'street', 'EAST', 'left');
  } else if (a.kind === 'park') {
    // a hedge along the top, with a gap you walk out through
    fill(a, 0, 0, a.w, 2, TILE.TREE);
    addDoor(a, (a.w >> 1) - 1, 0, 'street', null, 'down');
    addDoor(a, a.w - 1, a.h >> 1, pick(), null, 'left');
    addDoor(a, 0, a.h >> 1, pick(), null, 'right');
  } else {
    /*
     * The main exit goes in the top wall, which is the only two-row
     * band an interior has — a 2x2 doorway will not fit in the single
     * row along the bottom.
     */
    const exitX = rng.int(3, a.w - 5);
    addDoor(a, exitX, 0, entranceKind || pick(), null, 'down');
    // one or two more, on the sides
    const extra = rng.int(1, 2);
    const used = new Set();
    for (let i = 0; i < extra; i++) {
      const side = rng.chance(0.5) ? 0 : a.w - 1;
      let y = rng.int(4, a.h - 5);
      let guard = 0;
      while (used.has(side + ':' + y) && guard++ < 20) y = rng.int(4, a.h - 5);
      used.add(side + ':' + y);
      addDoor(a, side, y, pick(), null, side === 0 ? 'right' : 'left');
      // clear both rows the 1x2 door opens onto
      const inX = side === 0 ? 1 : a.w - 2;
      set(a, inX, y, TILE.FLOOR);
      set(a, inX, y + 1, TILE.FLOOR);
    }
  }
}

const FACE_STEP = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

/** Clear a walkable apron in front of every door, so none can be sealed off. */
function clearDoorAprons(a) {
  const ground = KINDS[a.kind].indoor ? TILE.FLOOR : TILE.SIDEWALK;
  const clamp = (v, hi) => Math.max(0, Math.min(hi, v));
  for (const d of a.doors) {
    const [dx, dy] = FACE_STEP[d.face] || [0, -1];
    // the apron sits past the far edge of the door, not past its origin
    const span = d.vertical ? [[d.x, d.y], [d.x, d.y + 1]] : [[d.x, d.y + 1], [d.x + 1, d.y + 1]];
    const front = d.vertical
      ? span.map(([sx, sy]) => [sx + dx, sy])
      : span.map(([sx, sy]) => [sx, sy + (dy > 0 ? 1 : dy < 0 ? -1 : -1)]);

    const mats = [];
    for (const [fx, fy] of front) {
      const cx = clamp(fx, a.w - 1);
      const cy = clamp(fy, a.h - 1);
      set(a, cx, cy, ground);
      mats.push([cx, cy]);
      // one more step clear, so furniture can never box the apron in
      const ex = cx + dx;
      const ey = cy + dy;
      if (ex > 0 && ey > 0 && ex < a.w - 1 && ey < a.h - 1) set(a, ex, ey, ground);
    }
    // a mat in front of the whole width, so the exit is obvious at a glance
    for (const [mx, my] of mats) set(a, mx, my, TILE.DOORMAT);
    d.inX = mats[0][0];
    d.inY = mats[0][1];
  }
}

/**
 * Guarantee every door opens into the room proper.
 *
 * A generator can trap a door's apron in a pocket without meaning to —
 * the izakaya's counter plus its two lanterns sealed off the strip
 * along the back wall, so the entrance led into fourteen unreachable
 * tiles. Rather than special-case each generator, dig inward from any
 * apron that is not part of the largest walkable region until it joins.
 */
function connectDoors(a) {
  const ground = KINDS[a.kind].indoor ? TILE.FLOOR : TILE.SIDEWALK;

  const regions = () => {
    const comp = new Int16Array(a.w * a.h).fill(-1);
    let best = -1;
    let bestSize = 0;
    let id = 0;
    for (let y = 0; y < a.h; y++) {
      for (let x = 0; x < a.w; x++) {
        if (comp[idx(a, x, y)] >= 0 || tileById(tileIdAt(a, x, y)).solid) continue;
        let size = 0;
        const q = [[x, y]];
        comp[idx(a, x, y)] = id;
        while (q.length) {
          const [cx, cy] = q.pop();
          size++;
          for (const [dx, dy] of STEPS) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= a.w || ny >= a.h) continue;
            const i = idx(a, nx, ny);
            if (comp[i] >= 0 || tileById(tileIdAt(a, nx, ny)).solid) continue;
            comp[i] = id;
            q.push([nx, ny]);
          }
        }
        if (size > bestSize) {
          bestSize = size;
          best = id;
        }
        id++;
      }
    }
    return { comp, best };
  };

  for (const d of a.doors) {
    let { comp, best } = regions();
    if (best < 0 || comp[idx(a, d.inX, d.inY)] === best) continue;
    const [dx, dy] = FACE_STEP[d.face] || [0, -1];
    let x = d.inX;
    let y = d.inY;
    for (let step = 0; step < Math.max(a.w, a.h); step++) {
      x += dx;
      y += dy;
      if (x < 1 || y < 1 || x >= a.w - 1 || y >= a.h - 1) break;
      const joined = comp[idx(a, x, y)] === best;
      set(a, x, y, ground);
      if (joined) break;
    }
  }
}

/**
 * Open a way to anything walled in.
 *
 * Generators place props before doors exist, so they cannot test
 * reachability themselves — a lone arcade cabinet dropped in front of
 * the izakaya's drinks counter sealed it off. Run afterwards: for each
 * stranded prop, clear the one neighbouring tile that bridges it back
 * to somewhere you can actually stand.
 */
function unstrandProps(a) {
  const ground = KINDS[a.kind].indoor ? TILE.FLOOR : TILE.SIDEWALK;
  for (let pass = 0; pass < 3; pass++) {
    const seen = walkableFrom(a);
    let fixed = false;
    for (const p of [...a.npcs, ...a.props]) {
      if (STEPS.some(([dx, dy]) => seen.has(`${p.x + dx},${p.y + dy}`))) continue;
      for (const [dx, dy] of STEPS) {
        const nx = p.x + dx;
        const ny = p.y + dy;
        if (nx < 1 || ny < 1 || nx >= a.w - 1 || ny >= a.h - 1) continue;
        // only useful if clearing it actually touches walkable ground
        if (!STEPS.some(([ex, ey]) => seen.has(`${nx + ex},${ny + ey}`))) continue;
        set(a, nx, ny, ground);
        fixed = true;
        break;
      }
    }
    if (!fixed) break;
  }
}

function placeNpcs(a, rng) {
  if (a.kind === 'apartment') return;
  const n =
    a.kind === 'office_floor' || a.kind === 'break_room'
      ? rng.int(1, 3)
      : a.kind === 'meeting_room'
        ? rng.int(1, 2)
        : rng.int(0, 1);
  const spots = freeSpots(a, rng, n, 3);
  const cast = rng.shuffle(CAST);
  spots.forEach((p, i) => {
    const c = cast[i % cast.length];
    a.npcs.push({ x: p.x, y: p.y, kind: c.kind, castId: c.id, facing: rng.pick(['down', 'left', 'right']) });
  });
}

/**
 * Scatter interactive people and objects. Objects attach to a piece of
 * furniture that is already in the room where possible, so they inherit
 * real art; if the room has none of that tile, one is placed in a clear
 * spot. People are placed as ordinary NPCs carrying an interaction id.
 */
function placeInteractions(a, rng) {
  const people = interactionsFor(a.kind, 'person');
  const objects = interactionsFor(a.kind, 'object');

  const nPeople = people.length ? rng.int(1, 3) : 0;
  const nObjects = objects.length ? rng.int(2, 4) : 0;

  const usedIds = new Set();
  const pickFrom = (pool) => {
    const avail = pool.filter((o) => !usedIds.has(o.id));
    if (!avail.length) return null;
    const chosen = rng.weighted(avail.map((o) => ({ o, weight: o.w ?? 1 }))).o;
    usedIds.add(chosen.id);
    return chosen;
  };

  const standable = walkableFrom(a);
  for (const p of freeSpots(a, rng, nPeople, 3)) {
    const it = pickFrom(people);
    if (!it) break;
    // a person nobody can walk up to is just scenery
    if (!standable.has(`${p.x},${p.y}`)) continue;
    a.npcs.push({
      x: p.x, y: p.y,
      kind: rng.pick(['salaryman', 'bob', 'senior', 'clerk']),
      castId: null,
      interId: it.id,
      // a stranger's accent is fixed for as long as they stand there
      voice: pickVoice(rng),
      voiceLine: rng.int(0, 9),
      facing: rng.pick(['down', 'left', 'right']),
    });
  }

  /*
   * A curio has to be one you can actually stand next to and press A on.
   * "Has a non-solid neighbour" is not enough — the strip behind the
   * izakaya counter is open floor that is walled off from the room, so
   * bills placed there were visible, described and permanently out of
   * reach. Test against tiles genuinely reachable from the entrance.
   */
  let reach = walkableFrom(a);
  const canReach = (x, y) => STEPS.some(([dx, dy]) => reach.has(`${x + dx},${y + dy}`));

  for (let i = 0; i < nObjects; i++) {
    const it = pickFrom(objects);
    if (!it) break;
    const want = TILE[it.tile];
    // prefer a matching tile the generator already placed
    const matches = [];
    if (want) {
      for (let y = 1; y < a.h - 1; y++) {
        for (let x = 1; x < a.w - 1; x++) {
          if (a.tiles[idx(a, x, y)] !== want.id) continue;
          if (a.props.some((pr) => pr.x === x && pr.y === y)) continue;
          if (!canReach(x, y)) continue;
          matches.push({ x, y });
        }
      }
    }
    let spot = matches.length ? rng.pick(matches) : null;
    if (!spot) {
      // A poster or a fire extinguisher belongs on a wall. If this room
      // has no free wall for it, skip it — the fallback would drop a
      // featureless block of wall in the middle of the carpet.
      if (WALL_ONLY.has(it.tile)) continue;
      spot = freeSpots(a, rng, 1, 2)[0];
      if (!spot || !canReach(spot.x, spot.y)) continue;
      if (want && want.solid) {
        // Dropping furniture can re-seal the corridor connectDoors just
        // dug, so put it back if it cuts the room in two.
        const before = a.tiles[idx(a, spot.x, spot.y)];
        set(a, spot.x, spot.y, want);
        if (!allDoorsConnected(a)) a.tiles[idx(a, spot.x, spot.y)] = before;
        reach = walkableFrom(a);
      }
    }
    a.props.push({ type: 'curio', interId: it.id, x: spot.x, y: spot.y });
  }
}

/* ---------- the world ---------- */

export class World {
  constructor(seed) {
    this.seed = seed >>> 0;
    this.areas = new Map();
    this.nextId = 1;
  }

  /** Build a fresh area of the given kind. */
  create(kind, entranceKind = null) {
    const id = this.nextId++;
    const seed = hash(`${this.seed}:${kind}:${id}`);
    const rng = new RNG(seed);
    const k = KINDS[kind] || KINDS.street;
    let name = k.title;
    if (kind === 'street') name = `${rng.pick(STREET_NAMES)} ST.`;
    else if (kind === 'station') name = `${rng.pick(STREET_NAMES)} STATION`;
    else if (kind === 'office_floor') name = `OFFICE ${rng.pick(FLOOR_SUFFIX)}`;
    else if (kind === 'park') name = `${rng.pick(STREET_NAMES)} PARK`;
    else if (kind === 'izakaya') name = `IZAKAYA ${rng.pick(STREET_NAMES)}`;

    const a = blank(kind, id, name, seed);
    const meta = GENERATORS[kind](a, rng) || {};
    a.encounterScale = meta.encounter ?? 1;
    placeDoors(a, rng, entranceKind);
    clearDoorAprons(a);
    connectDoors(a);
    unstrandProps(a);
    placeNpcs(a, rng);
    placeInteractions(a, rng);
    // aprons, connectivity and access again: a curio may have dropped
    // furniture in front of a door or across the way to another prop
    clearDoorAprons(a);
    connectDoors(a);
    unstrandProps(a);
    this.areas.set(id, a);
    return a;
  }

  get(id) {
    return this.areas.get(id);
  }

  /**
   * Walk through a door. Generates and links the far side on first
   * use, and always installs a return door, so you can never be
   * stranded.
   */
  travel(area, doorIndex) {
    const door = area.doors[doorIndex];
    if (door.toId && this.areas.has(door.toId)) {
      const dest = this.areas.get(door.toId);
      const back = dest.doors[door.toDoor];
      return { area: dest, x: back ? back.inX : 2, y: back ? back.inY : 2 };
    }
    const dest = this.create(door.kind, area.kind);
    // the first door of the new area becomes the way back
    let backIndex = dest.doors.findIndex((d) => d.kind === area.kind && d.toId === null);
    if (backIndex < 0) backIndex = 0;
    const back = dest.doors[backIndex];
    door.toId = dest.id;
    door.toDoor = backIndex;
    back.toId = area.id;
    back.toDoor = doorIndex;
    back.label = area.name;
    return { area: dest, x: back.inX, y: back.inY };
  }

  /** Door index at a tile, or -1. */
  doorAt(area, x, y) {
    return area.doors.findIndex((d) => doorCovers(d, x, y));
  }

  /** Serialise just enough to rebuild: ids, kinds, and links. */
  toJSON() {
    return {
      seed: this.seed,
      nextId: this.nextId,
      areas: [...this.areas.values()].map((a) => ({
        id: a.id,
        kind: a.kind,
        name: a.name,
        seed: a.seed,
        links: a.doors.map((d) => [d.toId, d.toDoor]),
      })),
    };
  }
}

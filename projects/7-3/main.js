/* 7-3 — bootstrap */

import { Game } from './src/game.js';
import { sfx } from './src/audio.js';

const canvas = document.getElementById('game');
const shell = document.getElementById('console');
const game = new Game(canvas, shell);

game.attach();

// Audio can only start from a gesture; the first one anywhere does it.
const wake = () => {
  sfx.resume();
  if (game.scene !== 'title' && game.scene !== 'boot') sfx.startMusic('day');
};
addEventListener('pointerdown', wake, { once: true });
addEventListener('keydown', wake, { once: true });

// Autopilot and speed live on the console, not in the game screen.
document.getElementById('autoBtn').addEventListener('click', () => {
  sfx.resume();
  game.auto.toggle();
  game.syncHud();
});

const SPEEDS = [1, 2, 4];
const speedBtn = document.getElementById('speedBtn');
speedBtn.addEventListener('click', () => {
  const i = (SPEEDS.indexOf(game.speed) + 1) % SPEEDS.length;
  game.speed = SPEEDS[i];
  speedBtn.textContent = `${game.speed}×`;
});

// Keep the canvas crisp when the layout settles or the tab returns.
addEventListener('pageshow', () => game.resize());
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) game.resize();
});

// Expose for the dev harness only; harmless in production.
window.__game = game;

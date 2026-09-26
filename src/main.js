// 진입점: 루프, 입력(Pointer Events), 리사이즈, 가시성 처리, URL 옵션
import './style.css';
import { Renderer } from './render.js';
import { Game } from './game.js';
import { UI } from './ui.js';
import { initAudio, setMuted, suspend, resume, isMuted } from './audio.js';
import * as meta from './meta.js';

const params = new URLSearchParams(location.search);
const opts = {
  debug: params.has('debug'),
  seed: params.has('seed') ? Number(params.get('seed')) >>> 0 : null,
  hearts: params.has('hearts') ? Math.max(1, +params.get('hearts') || 1) : null,
  world: params.get('world'),
  startHole: params.has('hole') ? Math.max(0, Math.min(17, (+params.get('hole') || 1) - 1)) : 0,
};

const canvas = document.getElementById('cv');
const renderer = new Renderer(canvas);
const ui = new UI();
const game = new Game(renderer, ui, opts);
ui.bind(game, opts);

const m = meta.meta();
setMuted(!!m.settings.muted);

function onResize() {
  renderer.resize();
  ui.layoutView();
  game.camTarget(true);
}
window.addEventListener('resize', onResize);
window.addEventListener('orientationchange', () => setTimeout(onResize, 200));

// ---------- 입력 ----------
let activeId = null;
const pos = (e) => {
  const r = canvas.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
};
canvas.addEventListener('pointerdown', (e) => {
  initAudio();
  if (activeId !== null && activeId !== e.pointerId) return;
  activeId = e.pointerId;
  try {
    canvas.setPointerCapture(e.pointerId);
  } catch {
    /* 무시 */
  }
  const [x, y] = pos(e);
  game.onDown(x, y);
  e.preventDefault();
});
canvas.addEventListener('pointermove', (e) => {
  if (e.pointerId !== activeId) return;
  const [x, y] = pos(e);
  game.onMove(x, y);
});
const up = (e) => {
  if (e.pointerId !== activeId) return;
  activeId = null;
  game.onUp();
};
canvas.addEventListener('pointerup', up);
canvas.addEventListener('pointercancel', (e) => {
  if (e.pointerId !== activeId) return;
  activeId = null;
  game.onCancel();
});
// 첫 터치 이후 오디오 재개 (버튼 탭 포함)
window.addEventListener('pointerdown', () => initAudio(), { capture: true });
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener(
  'touchmove',
  (e) => {
    if (!e.target.closest || !e.target.closest('.list, .codex, .screen')) e.preventDefault();
  },
  { passive: false }
);

// 데스크톱 키보드
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'p') {
    if (game.paused) ui.resume();
    else ui.pause();
  }
});

// ---------- 가시성 ----------
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    ui.pause();
    suspend();
  } else if (!isMuted()) resume();
});

// ---------- 루프 ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  game.update(dt);
  renderer.draw(game, dt, game.time);
  requestAnimationFrame(frame);
}

onResize();
ui.showTitle();
requestAnimationFrame(frame);

if (opts.debug) {
  window.__game = game;
  window.__ui = ui;
  window.__meta = meta;
}

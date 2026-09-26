// 진입점: 초기화, 메인 루프, 리사이즈, 일시정지 처리
import { World } from './world.js';
import { CharRenderer, Hat } from './chars.js';
import { Entities } from './entities.js';
import { Swarm } from './swarm.js';
import { Particles, Popups } from './fx.js';
import { UI } from './ui.js';
import { Game } from './game.js';
import { createInput } from './input.js';
import { save, loadSave, persist, buyUpgrade, buySkin, selectSkin, selectTheme, claimStreak, ensureDaily, levelUpSkin, unlockSkinFrags } from './data.js';
import { initAudio, unlockAudio, setMuted, setMusicMuted, startMusic, sfx, suspendAudio, resumeAudio } from './audio.js';

const q = new URLSearchParams(location.search);
const num = (k) => (q.has(k) && q.get(k) !== '' && !isNaN(+q.get(k)) ? +q.get(k) : undefined);
const opts = {
  debug: q.has('debug'),
  god: q.has('god'),
  start: num('start'),
  count: num('count'),
  seed: num('seed'),
  speed: num('speed'),
  fast: num('fast') || 1,
  fortHp: num('forthp'),
  noRevive: q.has('norevive'),
  noTutorial: q.has('notut'),
  chunks: q.get('chunks') ? q.get('chunks').split(',') : null,
};

const app = document.getElementById('app');
const canvas = document.getElementById('gl');
const uiRoot = document.getElementById('ui');

const world = new World(canvas);
const chars = new CharRenderer(world.scene);
const ents = new Entities(world.scene);
const swarm = new Swarm();
const parts = new Particles(world.scene);
loadSave();
ensureDaily();
initAudio(save.muteSfx, save.muteMusic);
const hat = new Hat(world.scene);

let game;
const ui = new UI(uiRoot, {
  click: () => { unlockAudio(); sfx.click(); },
  start: () => { unlockAudio(); startMusic(); game.startRun(false); },
  weekly: () => { unlockAudio(); startMusic(); game.startRun(true); },
  restart: () => { unlockAudio(); startMusic(); game.startRun(!!game.weekly); },
  revive: () => game.revive(),
  giveUp: () => game.finishRun(),
  buySkin: (id) => { const ok = buySkin(id); if (ok) { sfx.powerup(); game.applySkin(); } return ok; },
  selectSkin: (id) => { selectSkin(id); game.applySkin(); },
  selectTheme: (i) => { selectTheme(i); game.world.resetTheme(i); },
  claimStreak: () => { const r = claimStreak(); if (r) sfx.powerup(); return r; },
  pause: () => game.pause(),
  resume: () => game.resume(),
  toTitle: () => game.titleSetup(),
  toggleSfx: () => { save.muteSfx = !save.muteSfx; setMuted(save.muteSfx); persist(); ui.refreshMute(); },
  toggleMusic: () => { save.muteMusic = !save.muteMusic; setMusicMuted(save.muteMusic); persist(); ui.refreshMute(); },
  levelUpSkin: (id) => { const ok = levelUpSkin(id); if (ok) { sfx.powerup(); game.applySkin(); } return ok; },
  unlockFrags: (id) => { const ok = unlockSkinFrags(id); if (ok) { sfx.powerup(); game.applySkin(); } return ok; },
  buy: (id) => { const ok = buyUpgrade(id); if (ok) sfx.powerup(); return ok; },
});
const popups = new Popups(ui.fx, world.camera);
game = new Game({ world, chars, ents, swarm, parts, popups, ui, opts, hat });

createInput(canvas, (a) => { unlockAudio(); game.action(a); });
// 첫 터치 이후 오디오 재개 + 음악 시작 (타이틀 루프 포함)
const firstTouch = () => { unlockAudio(); startMusic(); window.removeEventListener('pointerdown', firstTouch, true); };
window.addEventListener('pointerdown', firstTouch, true);

function resize() {
  const w = app.clientWidth, h = app.clientHeight;
  world.resize(w, h);
}
window.addEventListener('resize', resize);
resize();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) { game.pause(); suspendAudio(); }
  else resumeAudio();
});
window.addEventListener('blur', () => game.pause());
document.addEventListener('contextmenu', (e) => e.preventDefault());

// 첫 실행: 메뉴 없이 바로 튜토리얼 달리기
if (!save.tutorialDone && !opts.noTutorial) game.startRun(false);

let fpsEl = null, fpsAcc = 0, fpsN = 0;
if (opts.debug) {
  fpsEl = document.createElement('div');
  fpsEl.id = 'fps';
  uiRoot.appendChild(fpsEl);
}
window.__game = game;
window.__sfx = sfx;

let last = performance.now();
function frame(now) {
  requestAnimationFrame(frame);
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.25) dt = 0.25;
  const sub = Math.max(1, Math.ceil(dt / (1 / 30)));
  const h = dt / sub;
  for (let k = 0; k < opts.fast; k++) for (let i = 0; i < sub; i++) game.update(h);
  world.render();
  if (fpsEl) {
    fpsAcc += dt; fpsN++;
    if (fpsAcc > 0.5) { fpsEl.textContent = `${Math.round(fpsN / fpsAcc)}fps ${world.renderer.info.render.calls}dc`; fpsAcc = 0; fpsN = 0; }
  }
}
requestAnimationFrame(frame);

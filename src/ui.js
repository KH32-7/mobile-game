// DOM UI: HUD, 오버레이 화면들 (타이틀, 보상, 상점, 결과, 일시정지, 메타 화면)
import { RELICS, RELIC_MAP, CONSUMABLES, drawRelicIcon } from './relics.js';
import { WORLDS, WORLD_MAP, STAR_GOALS, BALL_SKINS, TRAILS, FLAGS } from './worlds.js';
import { RUN } from './config.js';
import { fmtToPar } from './storage.js';
import { sfx, setMuted, isMuted, initAudio, startBgm } from './audio.js';
import { dateSeedStr, hashStr } from './rng.js';
import * as meta from './meta.js';
import { drawBallSkin, drawFlag } from './draw.js';

const $ = (s, root = document) => root.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------- 아이콘 ----------
const iconCache = new Map();
export function relicIcon(id, size = 64, silhouette = false) {
  const key = id + size + silhouette;
  if (iconCache.has(key)) return iconCache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d');
  drawRelicIcon(x, id, size);
  if (silhouette) {
    x.globalCompositeOperation = 'source-in';
    x.fillStyle = '#4b5563';
    x.fillRect(0, 0, size, size);
    x.globalCompositeOperation = 'source-over';
    x.fillStyle = '#e5e7eb';
    x.font = `900 ${size * 0.42}px system-ui,sans-serif`;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText('?', size / 2, size / 2 + 1);
  }
  const url = c.toDataURL();
  iconCache.set(key, url);
  return url;
}
const HEART = (fill, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24"><path d="M12 21.4l-1.5-1.3C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.5 11.5L12 21.4z" fill="${fill}" stroke="#fff" stroke-width="1.6"/></svg>`;
const GEM = `<svg class="gem" viewBox="0 0 24 24" width="16" height="16"><path d="M6 3h12l4 6-10 12L2 9z" fill="#4dd0e1" stroke="#fff" stroke-width="1.5"/><path d="M2 9h20M9 3l3 18 3-18" stroke="#fff" stroke-width="1" fill="none" opacity=".7"/></svg>`;
const STAR = (on) => `<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2l3 6.6 7.2.8-5.4 4.9 1.5 7.1L12 17.8 5.7 21.4l1.5-7.1L1.8 9.4 9 8.6z" fill="${on ? '#ffd54f' : 'rgba(255,255,255,0.25)'}" stroke="${on ? '#fff' : 'rgba(255,255,255,0.4)'}" stroke-width="1.2"/></svg>`;
const PAUSE = `<svg viewBox="0 0 24 24"><rect x="5" y="4" width="5" height="16" rx="1.5" fill="#16301f"/><rect x="14" y="4" width="5" height="16" rx="1.5" fill="#16301f"/></svg>`;
const SPK = (on) => `<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#16301f"/>${on ? '<path d="M16 8c1.5 1.2 1.5 6.8 0 8M19 5c3 2.5 3 11.5 0 14" stroke="#16301f" stroke-width="2" fill="none" stroke-linecap="round"/>' : '<path d="M16 9l6 6M22 9l-6 6" stroke="#e53935" stroke-width="2.4" stroke-linecap="round"/>'}</svg>`;
const ICONS = {
  mission: `<svg viewBox="0 0 24 24" width="26" height="26"><rect x="4" y="3" width="16" height="18" rx="3" fill="#fff"/><path d="M8 9l2 2 4-4M8 15h8" stroke="#1c8a3e" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`,
  collect: `<svg viewBox="0 0 24 24" width="26" height="26"><circle cx="12" cy="12" r="9" fill="#fff"/><circle cx="9" cy="9" r="3" fill="#e0e0e0"/><path d="M6 17c3 2 9 2 12-2" stroke="#ff4f8b" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`,
  codex: `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 4h7v16H4zM13 4h7v16h-7z" fill="#fff"/><path d="M6 8h3M6 11h3M15 8h3M15 11h3" stroke="#7e57c2" stroke-width="2"/></svg>`,
  records: `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M7 3h10v5a5 5 0 01-10 0z" fill="#ffd54f"/><path d="M7 5H3c0 4 2 5 4 5M17 5h4c0 4-2 5-4 5" stroke="#fff" stroke-width="2" fill="none"/><path d="M10 14h4v4h3v3H7v-3h3z" fill="#fff"/></svg>`,
};

export class UI {
  constructor() {
    this.overlay = $('#overlay');
    this.toastT = null;
    this.titleWorld = null;
  }
  bind(game, opts) {
    this.g = game;
    this.opts = opts;
    $('#btnPause').innerHTML = PAUSE;
    $('#btnPause').addEventListener('click', () => {
      sfx.click();
      this.pause();
    });
    $('#btnView').addEventListener('click', () => {
      sfx.click();
      game.cam.overview = !game.cam.overview;
      $('#btnView').classList.toggle('on', game.cam.overview);
      $('#btnView').textContent = game.cam.overview ? '공 따라가기' : '전체 보기';
    });
    $('#btnMulligan').addEventListener('click', () => game.useMulligan());
    $('#hudRelics').addEventListener('click', (e) => {
      const id = e.target && e.target.dataset && e.target.dataset.id;
      const r = RELIC_MAP[id];
      if (r) this.toast(`<b>${r.name}</b><br>${r.desc}`);
    });
    if (opts.debug) {
      const db = $('#debugBar');
      db.classList.remove('hidden');
      db.innerHTML = `<button data-a="auto">자동샷</button><button data-a="sink">홀인</button><button data-a="heart">하트-1</button>`;
      db.addEventListener('click', (e) => {
        const a = e.target.dataset.a;
        if (a === 'auto') game.debugAutoShot();
        if (a === 'sink') game.debugSink();
        if (a === 'heart') game.debugLoseHeart();
      });
    }
  }

  layoutView() {
    const hud = $('#hud');
    const bar = $('#bottomBar');
    const app = $('#app').getBoundingClientRect();
    const hr = hud.classList.contains('hidden') ? 0 : hud.getBoundingClientRect().bottom - app.top;
    const br = bar.classList.contains('hidden') ? app.height : bar.getBoundingClientRect().top - app.top;
    this.g.layout(Math.max(hr + 4, 20), br - 2);
  }

  // ---------- HUD ----------
  hud(g, flash) {
    const r = g.run;
    const show = !!r && ['intro', 'ready', 'rolling', 'celebrate', 'decide'].includes(g.state);
    $('#hud').classList.toggle('hidden', !show);
    $('#bottomBar').classList.toggle('hidden', !show);
    if (!show) {
      $('#hudTimer').classList.add('hidden');
      return;
    }
    const boss = g.hole.boss ? '<span class="boss">BOSS</span>' : '';
    $('#hudHole').innerHTML = `HOLE ${r.holeIdx + 1}<span style="opacity:.7;font-size:13px">/${RUN.holes}</span>${boss}`;
    const over = g.strokes >= g.par;
    $('#hudPar').innerHTML = `파 ${g.par} · <b style="color:${over ? '#ff8a80' : '#ffe57f'}">${g.strokes}타</b> · 합계 ${fmtToPar(r.strokesTotal - r.parTotal)}`;
    let hs = '';
    for (let i = 0; i < r.maxHearts; i++) hs += HEART(i < r.hearts ? '#ff4f8b' : 'rgba(0,0,0,0.35)', flash === 'heart' && i === r.hearts ? 'lost' : '');
    $('#hudHearts').innerHTML = hs;
    const coinsEl = $('#hudCoins');
    coinsEl.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" style="vertical-align:-2px"><circle cx="12" cy="12" r="9" fill="#ffca28" stroke="#fff" stroke-width="2"/></svg> ${r.coins}`;
    if (flash === 'coin') {
      coinsEl.classList.remove('bump');
      void coinsEl.offsetWidth;
      coinsEl.classList.add('bump');
    }
    const rel = r.relics.map((id) => `<img data-id="${id}" src="${relicIcon(id, 48)}" alt="${esc(RELIC_MAP[id].name)}">`).join('');
    if ($('#hudRelics').dataset.k !== r.relics.join()) {
      $('#hudRelics').innerHTML = rel;
      $('#hudRelics').dataset.k = r.relics.join();
      requestAnimationFrame(() => this.layoutView());
    }
    $('#btnMulligan').classList.toggle('hidden', !(g.canMulligan() && g.state === 'ready'));
    $('#hudTimer').classList.toggle('hidden', !(g.hole.timeLimit > 0));
  }
  timer(t) {
    const el = $('#hudTimer');
    el.textContent = `남은 시간 ${Math.max(0, Math.ceil(t))}`;
    el.classList.toggle('warn', t < 10);
  }
  banner(main, sub, boss) {
    const b = $('#banner');
    if (!main) {
      b.classList.add('hidden');
      return;
    }
    b.innerHTML = `<div class="b-main">${main}</div>${sub ? `<div class="b-sub">${sub}</div>` : ''}${boss ? `<div><div class="b-boss">${boss}</div></div>` : ''}`;
    b.classList.remove('hidden');
    b.style.animation = 'none';
    void b.offsetWidth;
    b.style.animation = '';
  }
  toast(html, ms = 1800) {
    const t = $('#toast');
    t.innerHTML = html;
    t.classList.remove('hidden');
    clearTimeout(this.toastT);
    this.toastT = setTimeout(() => t.classList.add('hidden'), ms);
  }
  showTutorial(on) {
    $('#tutorial').classList.toggle('hidden', !on);
  }

  screen(html, cls = '') {
    this.overlay.innerHTML = `<div class="screen ${cls}">${html}</div>`;
    const root = this.overlay.firstElementChild;
    root.addEventListener('click', (e) => {
      if (e.target.closest('button')) sfx.click();
    });
    return root;
  }
  close() {
    this.overlay.innerHTML = '';
  }

  // ---------- 타이틀 ----------
  showTitle() {
    const g = this.g;
    const m = meta.meta();
    meta.rollDaily();
    if (!this.titleWorld || !m.worlds[this.titleWorld].unlocked) this.titleWorld = m.selWorld;
    g.startDemo(this.titleWorld);
    this.hud(g);
    this.showTutorial(false);
    this.banner(null);
    $('#hudTimer').classList.add('hidden');
    this.layoutView();
    this.renderTitle();
    startBgm();
  }
  renderTitle() {
    const m = meta.meta();
    const wp = meta.worldProgress();
    const wi = WORLDS.findIndex((w) => w.id === this.titleWorld);
    const w = wp[wi];
    const run = m.run;
    const date = dateSeedStr();
    const dw = WORLDS[hashStr('dw-' + date) % WORLDS.length];
    const dBest = m.daily.best[date];
    const badge = meta.badgeCount();
    const notices = meta.takeNotices();
    const affordable = RELICS.some((r) => !m.unlockedRelics.includes(r.id) && meta.RELIC_PRICE[r.id] <= m.gems);
    const prevW = WORLDS[wi - 1];
    const worldCard = w.unlocked
      ? `<div class="wc-name">${w.name}</div><div class="wc-desc">${w.desc}</div>
         <div class="wc-stars">${w.stars.map((s) => STAR(s)).join('')}</div>
         <div class="wc-best">최고 ${w.bestHoles}홀${w.bestToPar != null ? ` · 완주 ${fmtToPar(w.bestToPar)}` : ''}</div>`
      : `<div class="wc-name">자물쇠 ${w.name}</div><div class="wc-desc">${prevW ? `${prevW.name}에서 별 1개 (전반 9홀 클리어) 필요` : ''}</div><div class="wc-stars">${w.stars.map(() => STAR(false)).join('')}</div>`;
    const root = this.screen(
      `
      <div class="topbar">
        <div class="pill">${GEM}<b id="gemCount">${m.gems}</b></div>
        <div class="pill">출석 <b>${m.daily.streak}</b>일</div>
        <div class="pill">별 <b>${meta.totalStars()}</b>/${WORLDS.length * 3}</div>
        <button class="icon-btn mute" id="tMute" aria-label="음소거">${SPK(!isMuted())}</button>
      </div>
      <div class="logo"><div class="l1">로그 퍼트</div><div class="l2">ROGUE PUTT</div><div class="l3">당겨서 치는 로그라이크 미니골프</div></div>
      <div class="world-card" style="--wc:${w.themes[0].voidA};--wc2:hsl(${w.themes[0].hue},${w.themes[0].sat}%,${w.themes[0].light}%)">
        <button class="wc-arrow" id="wPrev" aria-label="이전 월드" ${wi === 0 ? 'disabled' : ''}>&lsaquo;</button>
        <div class="wc-body ${w.unlocked ? '' : 'locked'}">${worldCard}<div class="wc-dots">${wp.map((x, i) => `<i class="${i === wi ? 'on' : ''} ${x.unlocked ? '' : 'lk'}"></i>`).join('')}</div></div>
        <button class="wc-arrow" id="wNext" aria-label="다음 월드" ${wi === WORLDS.length - 1 ? 'disabled' : ''}>&rsaquo;</button>
      </div>
      ${run ? `<button class="btn gold" id="tCont">이어하기<small>${WORLD_MAP[run.world].name}${run.mode === 'daily' ? ' 데일리' : ''} · ${run.holeIdx + 1}번 홀 · 하트 ${run.hearts}</small></button>` : ''}
      <button class="btn" id="tStart" ${w.unlocked ? '' : 'disabled'}>${w.unlocked ? `${w.name} 런 시작` : '잠긴 월드'}</button>
      <button class="btn ghost small" id="tDaily">데일리 코스<small>${date} · ${dw.name}${dBest ? ` · 오늘 최고 ${dBest.holes}홀 ${fmtToPar(dBest.toPar)}` : ' · 모두 같은 코스'}</small></button>
      <div class="meta-row">
        <button class="meta-btn" id="tMissions">${ICONS.mission}<span>미션</span>${badge ? `<em>${badge}</em>` : ''}</button>
        <button class="meta-btn" id="tCollect">${ICONS.collect}<span>컬렉션</span>${affordable ? '<em>N</em>' : ''}</button>
        <button class="meta-btn" id="tCodex">${ICONS.codex}<span>도감</span><small>${m.discovered.length}/${RELICS.length}</small></button>
        <button class="meta-btn" id="tRecords">${ICONS.records}<span>기록</span><small>${Object.keys(m.ach).length}/${meta.ACHIEVEMENTS.length}</small></button>
      </div>
      ${notices.length ? `<div class="notices">${notices.slice(-3).map((n) => `<div>${esc(n)}</div>`).join('')}</div>` : ''}
    `,
      'title'
    );
    const go = (fn) => () => {
      initAudio();
      fn();
    };
    $('#tMute', root).onclick = () => {
      initAudio();
      setMuted(!isMuted());
      m.settings.muted = isMuted();
      meta.persist();
      $('#tMute', root).innerHTML = SPK(!isMuted());
    };
    $('#wPrev', root).onclick = () => this.switchWorld(-1);
    $('#wNext', root).onclick = () => this.switchWorld(1);
    if (run) $('#tCont', root).onclick = go(() => {
      this.close();
      this.g.resumeRun(run);
    });
    $('#tStart', root).onclick = go(() => {
      if (!w.unlocked) return;
      m.selWorld = w.id;
      meta.persist();
      this.beginRun({ mode: 'normal', world: w.id });
    });
    $('#tDaily', root).onclick = go(() => this.beginRun({ mode: 'daily' }));
    $('#tMissions', root).onclick = go(() => this.missionsScreen());
    $('#tCollect', root).onclick = go(() => this.collectionScreen('relic'));
    $('#tCodex', root).onclick = go(() => this.codexScreen());
    $('#tRecords', root).onclick = go(() => this.recordsScreen('stats'));
  }
  switchWorld(d) {
    const wi = WORLDS.findIndex((w) => w.id === this.titleWorld);
    const ni = Math.max(0, Math.min(WORLDS.length - 1, wi + d));
    if (ni === wi) return;
    this.titleWorld = WORLDS[ni].id;
    if (meta.meta().worlds[this.titleWorld].unlocked) {
      meta.meta().selWorld = this.titleWorld;
      meta.persist();
    }
    this.g.startDemo(this.titleWorld);
    this.renderTitle();
  }
  beginRun(cfg) {
    const m = meta.meta();
    const start = (startRelic) => {
      this.close();
      this.g.newRun({ ...cfg, seed: this.opts.seed, startRelic });
    };
    const doStart = () => {
      if (m.perks.startRelic) this.startRelicScreen(start);
      else start(null);
    };
    if (m.run) {
      const root = this.screen(
        `<div class="card-panel"><h2>새 런을 시작할까요?</h2><div class="sub">진행 중인 런 (${WORLD_MAP[m.run.world].name} ${m.run.holeIdx + 1}번 홀)은 사라짐</div>
        <button class="btn" id="yes">새로 시작</button><button class="btn ghost small" id="no">취소</button></div>`
      );
      $('#yes', root).onclick = () => {
        meta.clearRun();
        doStart();
      };
      $('#no', root).onclick = () => this.renderTitle();
      return;
    }
    doStart();
  }
  startRelicScreen(cb) {
    const m = meta.meta();
    const pool = RELICS.filter((r) => m.unlockedRelics.includes(r.id));
    const pick = [];
    const p = pool.slice();
    while (pick.length < 3 && p.length) pick.push(p.splice(Math.floor(Math.random() * p.length), 1)[0]);
    const root = this.screen(
      `<div class="card-panel"><h2>시작 유물</h2><div class="sub">하나를 들고 출발</div>
      <div>${pick.map((r) => `<button class="relic-opt" data-id="${r.id}"><img src="${relicIcon(r.id, 104)}" alt=""><div><div class="rn">${r.name}</div><div class="rd">${r.desc}</div></div></button>`).join('')}</div>
      <button class="btn ghost small" id="none">유물 없이 시작</button></div>`
    );
    root.querySelectorAll('.relic-opt').forEach((b) => (b.onclick = () => cb(b.dataset.id)));
    $('#none', root).onclick = () => cb(null);
  }

  // ---------- 메타 화면들 ----------
  backBtn() {
    return `<button class="btn ghost small back" id="back">돌아가기</button>`;
  }
  wireBack(root) {
    $('#back', root).onclick = () => this.renderTitle();
  }
  missionsScreen() {
    const m = meta.meta();
    const ms = meta.missionView();
    const canStreak = meta.canClaimStreak();
    const root = this.screen(
      `<div class="card-panel wide">
        <h2>오늘의 미션</h2><div class="sub">매일 자정에 새 미션 · 보유 ${GEM} <b id="gemCount">${m.gems}</b></div>
        <div class="streak ${canStreak ? 'ready' : ''}">
          <div><b>${m.daily.streak}일 연속 출석</b><br><small>연속 출석할수록 보상 증가 (최대 7일)</small></div>
          <button class="mini-btn" id="streak" ${canStreak ? '' : 'disabled'}>${canStreak ? `받기 ${GEM}${meta.streakReward()}` : '받음'}</button>
        </div>
        ${ms
          .map(
            (v) => `<div class="mission ${v.done ? 'done' : ''}">
          <div class="m-t">${v.text}<div class="bar"><i style="width:${(v.prog / v.target) * 100}%"></i></div><small>${v.prog}/${v.target}</small></div>
          <button class="mini-btn" data-i="${v.i}" ${v.done && !v.claimed ? '' : 'disabled'}>${v.claimed ? '완료' : `${GEM}${v.reward}`}</button></div>`
          )
          .join('')}
      </div>${this.backBtn()}`
    );
    this.wireBack(root);
    $('#streak', root).onclick = () => {
      const n = meta.claimStreak();
      if (n) {
        sfx.coin();
        this.toast(`출석 보상 ${GEM} +${n}`);
      }
      this.missionsScreen();
    };
    root.querySelectorAll('[data-i]').forEach(
      (b) =>
        (b.onclick = () => {
          const n = meta.claimMission(+b.dataset.i);
          if (n) {
            sfx.relic();
            this.toast(`미션 보상 ${GEM} +${n}`);
          }
          this.missionsScreen();
        })
    );
  }
  collectionScreen(tab) {
    const m = meta.meta();
    const tabs = [
      ['relic', '유물'],
      ['ball', '공'],
      ['trail', '트레일'],
      ['flag', '깃발'],
      ['perk', '특전'],
    ];
    let body = '';
    if (tab === 'relic') {
      body = RELICS.filter((r) => r.id in meta.RELIC_PRICE)
        .map((r) => {
          const own = m.unlockedRelics.includes(r.id);
          const price = meta.RELIC_PRICE[r.id];
          return `<div class="shop-row"><img src="${relicIcon(r.id, 88)}" alt=""><div class="sr-t"><b>${r.name}</b><small>${r.desc}</small></div>
          <button class="mini-btn" data-buy="${r.id}" ${own || m.gems < price ? 'disabled' : ''}>${own ? '해금됨' : `${GEM}${price}`}</button></div>`;
        })
        .join('');
      body = `<div class="sub">해금하면 런 보상/상점에 등장함 (기본 ${meta.STARTER_RELICS.length}종)</div>` + body;
    } else if (tab === 'perk') {
      body = meta.PERKS.map((p) => {
        const own = !!m.perks[p.id];
        return `<div class="shop-row"><div class="perk-ic">★</div><div class="sr-t"><b>${p.name}</b><small>${p.desc}</small></div>
        <button class="mini-btn" data-perk="${p.id}" ${own || m.gems < p.price ? 'disabled' : ''}>${own ? '보유' : `${GEM}${p.price}`}</button></div>`;
      }).join('');
    } else {
      const list = { ball: BALL_SKINS, trail: TRAILS, flag: FLAGS }[tab];
      body = list
        .map((it) => {
          const own = m.cosmetics.owned[tab].includes(it.id);
          const eq = m.cosmetics.eq[tab] === it.id;
          return `<div class="shop-row"><canvas class="cos-prev" data-kind="${tab}" data-id="${it.id}" width="88" height="88"></canvas><div class="sr-t"><b>${it.name}</b></div>
          <button class="mini-btn ${eq ? 'on' : ''}" data-cos="${it.id}" ${eq || (!own && m.gems < it.price) ? 'disabled' : ''}>${eq ? '장착중' : own ? '장착' : `${GEM}${it.price}`}</button></div>`;
        })
        .join('');
    }
    const root = this.screen(
      `<div class="card-panel wide"><h2>컬렉션</h2><div class="sub">보유 ${GEM} <b id="gemCount">${m.gems}</b></div>
      <div class="tabs">${tabs.map(([k, n]) => `<button class="tab ${k === tab ? 'on' : ''}" data-tab="${k}">${n}</button>`).join('')}</div>
      <div class="list">${body}</div></div>${this.backBtn()}`
    );
    this.wireBack(root);
    root.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => this.collectionScreen(b.dataset.tab)));
    root.querySelectorAll('[data-buy]').forEach(
      (b) =>
        (b.onclick = () => {
          if (meta.unlockRelic(b.dataset.buy)) {
            sfx.relic();
            this.toast(`<b>${RELIC_MAP[b.dataset.buy].name}</b> 해금! 이제 런에 등장함`);
          }
          this.collectionScreen(tab);
        })
    );
    root.querySelectorAll('[data-perk]').forEach(
      (b) =>
        (b.onclick = () => {
          if (meta.buyPerk(b.dataset.perk)) sfx.relic();
          this.collectionScreen(tab);
        })
    );
    root.querySelectorAll('[data-cos]').forEach(
      (b) =>
        (b.onclick = () => {
          const id = b.dataset.cos;
          if (m.cosmetics.owned[tab].includes(id)) meta.equip(tab, id);
          else if (meta.buyCosmetic(tab, id)) sfx.relic();
          this.collectionScreen(tab);
        })
    );
    root.querySelectorAll('canvas.cos-prev').forEach((c) => drawCosPreview(c, c.dataset.kind, c.dataset.id));
  }
  codexScreen() {
    const m = meta.meta();
    const root = this.screen(
      `<div class="card-panel wide"><h2>유물 도감</h2><div class="sub">발견 ${m.discovered.length}/${RELICS.length} · 런에서 얻으면 등록됨</div>
      <div class="codex">${RELICS.map((r) => {
        const found = m.discovered.includes(r.id);
        const locked = !m.unlockedRelics.includes(r.id);
        return `<button class="cx ${found ? '' : 'unk'}" data-id="${r.id}"><img src="${relicIcon(r.id, 88, !found)}" alt=""><span>${found ? r.name : '???'}</span>${locked ? '<i>잠김</i>' : ''}</button>`;
      }).join('')}</div></div>${this.backBtn()}`
    );
    this.wireBack(root);
    root.querySelectorAll('.cx').forEach(
      (b) =>
        (b.onclick = () => {
          const r = RELIC_MAP[b.dataset.id];
          const found = m.discovered.includes(r.id);
          const locked = !m.unlockedRelics.includes(r.id);
          this.toast(found ? `<b>${r.name}</b><br>${r.desc}` : locked ? '잠긴 유물. 컬렉션에서 해금하면 런에 등장함' : '아직 발견하지 못한 유물. 런에서 찾아보기!');
        })
    );
  }
  recordsScreen(tab) {
    const m = meta.meta();
    const s = m.stats;
    const tabs = [
      ['stats', '통계'],
      ['ach', '업적'],
      ['worlds', '월드'],
    ];
    let body = '';
    if (tab === 'stats') {
      const rows = [
        ['플레이한 런', s.runs],
        ['완주 횟수', s.completes],
        ['클리어한 홀', s.holes],
        ['총 타수', s.strokes],
        ['홀당 평균 타수', s.holes ? (s.strokes / s.holes).toFixed(2) : '-'],
        ['홀인원', s.aces],
        ['이글 이상', s.eagles],
        ['버디 이하', s.birdies],
        ['파 이하 홀', s.parOrBetter],
        ['최저 타수 (18홀 완주)', s.bestRunStrokes ?? '-'],
        ['최고 기록 (파 대비)', fmtToPar(s.bestToPar)],
        ['최다 클리어 홀', s.bestHoles],
        ['보스 홀 클리어', s.bossClears],
        ['물에 빠진 횟수', s.water],
        ['범퍼 맞힌 횟수', s.bumpers],
        ['부순 상자', s.crates],
        ['주운 코스 코인', s.coins],
        ['데일리 코스', s.dailies],
        ['최장 연속 출석', s.maxStreak + '일'],
        ['모은 보석 (누적)', s.gemsEarned],
      ];
      body = `<div class="stat-list">${rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;
    } else if (tab === 'ach') {
      body = meta.ACHIEVEMENTS.map(
        (a) => `<div class="ach ${m.ach[a.id] ? 'got' : ''}"><div class="ach-ic">${m.ach[a.id] ? '★' : '☆'}</div><div class="sr-t"><b>${a.name}</b><small>${a.desc}</small></div><div class="ach-r">${GEM}${a.gems}</div></div>`
      ).join('');
    } else {
      body = meta
        .worldProgress()
        .map(
          (w) => `<div class="wrow ${w.unlocked ? '' : 'lk'}"><div class="wr-n" style="background:${w.themes[0].voidA}">${w.name}</div>
        <div class="sr-t">${w.stars.map((x, i) => `<div class="goal">${STAR(x)} ${STAR_GOALS[i]}</div>`).join('')}
        <small>최고 ${w.bestHoles}홀 · 완주 ${fmtToPar(w.bestToPar)} · 런 ${w.runs}회${w.unlocked ? '' : ' · 잠김'}</small></div></div>`
        )
        .join('');
    }
    const root = this.screen(
      `<div class="card-panel wide"><h2>기록</h2>
      <div class="tabs">${tabs.map(([k, n]) => `<button class="tab ${k === tab ? 'on' : ''}" data-tab="${k}">${n}</button>`).join('')}</div>
      <div class="list">${body}</div></div>${this.backBtn()}`
    );
    this.wireBack(root);
    root.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => this.recordsScreen(b.dataset.tab)));
  }

  // ---------- 인게임 화면 ----------
  pause() {
    const g = this.g;
    if (!g.run || g.paused || !['intro', 'ready', 'rolling', 'celebrate'].includes(g.state)) return;
    g.paused = true;
    g.aim = null;
    const rel = g.run.relics.map((id) => `<div class="shop-row sm"><img src="${relicIcon(id, 64)}" alt=""><div class="sr-t"><b>${RELIC_MAP[id].name}</b><small>${RELIC_MAP[id].desc}</small></div></div>`).join('');
    const root = this.screen(
      `<div class="menu-title">일시정지</div>
      <button class="btn" id="pResume">계속하기</button>
      <button class="btn ghost small" id="pRestart">새 런으로 재시작</button>
      <button class="btn ghost small" id="pTitle">타이틀로 (이어하기 저장됨)</button>
      <button class="btn ghost small" id="pMute">${isMuted() ? '소리 켜기' : '소리 끄기'}</button>
      ${rel ? `<div class="card-panel wide" style="margin-top:12px"><div class="sub" style="margin:0 0 6px">보유 유물</div><div class="list">${rel}</div></div>` : ''}`
    );
    $('#pResume', root).onclick = () => this.resume();
    $('#pRestart', root).onclick = () => {
      const cfg = { mode: g.run.mode, world: g.run.world };
      g.paused = false;
      meta.clearRun();
      this.close();
      this.beginRun(cfg);
    };
    $('#pTitle', root).onclick = () => {
      g.paused = false;
      this.close();
      g.quitToTitle();
    };
    $('#pMute', root).onclick = () => {
      setMuted(!isMuted());
      meta.meta().settings.muted = isMuted();
      meta.persist();
      $('#pMute', root).textContent = isMuted() ? '소리 켜기' : '소리 끄기';
    };
  }
  resume() {
    this.g.paused = false;
    this.close();
  }
  mulliganPrompt(g) {
    const root = this.screen(
      `<div class="card-panel"><h2>하트가 모두 떨어졌어요!</h2><div class="sub">멀리건으로 방금 샷을 되돌릴 수 있음</div>
      <button class="btn gold" id="mYes">멀리건 사용</button><button class="btn ghost small" id="mNo">결과 보기</button></div>`,
      'clear'
    );
    $('#mYes', root).onclick = () => {
      this.close();
      g.useMulligan();
    };
    $('#mNo', root).onclick = () => {
      this.close();
      g.gameOver();
    };
  }
  rewardScreen(g, options, cb) {
    this.hud(g);
    const r = g.run;
    const last = r.scorecard[r.scorecard.length - 1];
    const d = last.strokes - last.par;
    const root = this.screen(
      `<div class="card-panel"><h2>HOLE ${last.hole} 클리어</h2>
      <div class="sub">${last.strokes}타 (파 ${last.par}, ${fmtToPar(d)}) · 하트 ${r.hearts}/${r.maxHearts} · 코인 ${r.coins}</div>
      <div class="sub" style="margin-bottom:4px"><b>유물을 하나 고르세요</b></div>
      <div>${options
        .map((id) => {
          const def = RELIC_MAP[id] || CONSUMABLES.find((c) => c.id === id);
          const isNew = RELIC_MAP[id] && !meta.meta().discovered.includes(id);
          return `<button class="relic-opt" data-id="${id}"><img src="${relicIcon(id, 104)}" alt=""><div><div class="rn">${def.name}${isNew ? ' <span class="new">NEW</span>' : ''}</div><div class="rd">${def.desc}</div></div></button>`;
        })
        .join('')}</div>
      <button class="btn ghost small" id="skip">건너뛰고 코인 +${RUN.skipCoins}</button></div>`,
      'clear'
    );
    let done = false;
    root.querySelectorAll('.relic-opt').forEach(
      (b) =>
        (b.onclick = () => {
          if (done) return;
          done = true;
          this.close();
          cb(b.dataset.id);
        })
    );
    $('#skip', root).onclick = () => {
      if (done) return;
      done = true;
      this.close();
      cb(null);
    };
  }
  shopScreen(g, items, done) {
    const render = () => {
      const r = g.run;
      const root = this.screen(
        `<div class="card-panel"><h2>떠돌이 상점</h2><div class="coinline">보유 코인 ${r.coins} · 하트 ${r.hearts}/${r.maxHearts}</div>
        <div>${items
          .map((it, i) => {
            const def = RELIC_MAP[it.id] || CONSUMABLES.find((c) => c.id === it.id);
            const dis = it.sold || r.coins < it.price || (it.id === '_heart' && r.hearts >= r.maxHearts);
            return `<button class="relic-opt ${it.sold ? 'sold' : ''}" data-i="${i}" ${dis ? 'disabled' : ''}><img src="${relicIcon(it.id, 104)}" alt=""><div><div class="rn">${def.name}</div><div class="rd">${def.desc}</div></div><div class="price">${it.sold ? '판매됨' : it.price}</div></button>`;
          })
          .join('')}</div>
        <button class="btn" id="next">다음 홀로</button></div>`,
        'clear'
      );
      root.querySelectorAll('[data-i]').forEach(
        (b) =>
          (b.onclick = () => {
            if (g.buy(items[+b.dataset.i])) render();
          })
      );
      $('#next', root).onclick = () => {
        this.close();
        done();
      };
    };
    render();
  }
  resultScreen(g, d) {
    this.hud(g);
    this.showTutorial(false);
    $('#hudTimer').classList.add('hidden');
    const r = g.run;
    const m = meta.meta();
    const cells = [];
    for (let i = 0; i < RUN.holes; i++) {
      const sc = r.scorecard[i];
      if (!sc) cells.push(`<div class="none"><small>${i + 1}</small>-<small>&nbsp;</small></div>`);
      else {
        const df = sc.strokes - sc.par;
        cells.push(`<div class="${df < 0 ? 'under' : df > 0 ? 'over' : ''}"><small>${i + 1}</small>${sc.strokes}<small>P${sc.par}</small></div>`);
      }
    }
    const w = WORLD_MAP[r.world];
    const root = this.screen(
      `<div class="card-panel wide">
        <h2>${d.complete ? '코스 완주!' : '런 종료'}</h2>
        <div class="sub">${w.name}${r.mode === 'daily' ? ` 데일리 (${r.date})` : ''} ${d.newBest ? '<span class="newbest">최고 기록!</span>' : ''}</div>
        <div class="big-stat"><div>클리어<b>${d.holesCleared}</b></div><div>타수<b>${r.strokesTotal}</b></div><div>파 대비<b>${fmtToPar(d.toPar)}</b></div></div>
        <div class="score-grid">${cells.join('')}</div>
        ${r.relics.length ? `<div class="relic-row">${r.relics.map((id) => `<img src="${relicIcon(id, 56)}" alt="">`).join('')}</div>` : ''}
        <div class="gain list-like">${GEM} <b>+${d.gems}</b> 보석 <small>${d.breakdown.map(([k, v]) => `${k} ${v}`).join(' · ')}</small></div>
        ${d.newStars.length ? `<div class="gain star">새 별 ${d.newStars.map(() => STAR(true)).join('')} ${d.newStars.map((i) => STAR_GOALS[i]).join(', ')}</div>` : ''}
        ${d.unlockedWorlds.length ? `<div class="gain world">새 월드 해금: <b>${d.unlockedWorlds.map((id) => WORLD_MAP[id].name).join(', ')}</b></div>` : ''}
        ${d.ach.length ? `<div class="gain list-like">업적: ${d.ach.map((a) => `<b>${a.name}</b>`).join(', ')}</div>` : ''}
        <div class="sub" style="margin:6px 0 0">최고 기록 ${m.stats.bestHoles}홀 · 완주 ${fmtToPar(m.stats.bestToPar)} · 보유 ${GEM}${m.gems}</div>
        <button class="btn" id="again">다시 하기</button>
        <button class="btn ghost small" id="title">타이틀로</button>
      </div>`
    );
    $('#again', root).onclick = () => this.beginRun({ mode: r.mode, world: r.world });
    $('#title', root).onclick = () => g.quitToTitle();
  }
}

// 꾸미기 미리보기
export function drawCosPreview(c, kind, id) {
  const x = c.getContext('2d');
  const s = c.width;
  x.clearRect(0, 0, s, s);
  x.fillStyle = '#6cc644';
  x.beginPath();
  x.arc(s / 2, s / 2, s / 2 - 2, 0, 7);
  x.fill();
  if (kind === 'ball') {
    drawBallSkin(x, s / 2, s / 2, s * 0.22, BALL_SKINS.find((b) => b.id === id), 0);
  } else if (kind === 'trail') {
    const t = TRAILS.find((b) => b.id === id);
    for (let i = 0; i < 10; i++) {
      const u = i / 10;
      x.fillStyle = t.rainbow ? `hsla(${i * 36},90%,65%,${0.2 + u * 0.6})` : `rgba(${t.color},${0.15 + u * 0.7})`;
      x.beginPath();
      x.arc(s * 0.15 + u * s * 0.55, s * 0.7 - u * s * 0.35, s * 0.05 + u * s * 0.07, 0, 7);
      x.fill();
    }
    drawBallSkin(x, s * 0.74, s * 0.33, s * 0.12, BALL_SKINS[0], 0);
  } else {
    drawFlag(x, s * 0.4, s * 0.75, s * 0.55, FLAGS.find((f) => f.id === id), '#ff3d3d', 0);
  }
}


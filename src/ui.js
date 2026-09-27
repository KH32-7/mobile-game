// DOM 오버레이 (타이틀, 설정, 상점, 결과, 컬렉션, 미션, 프로필, 툴팁, 토스트, 코치 마크)
import { CONFIG, COLORS } from './config.js';
import { JOKERS, JOKER_BY_ID, RARITY_LABEL, RARITY_COLOR, EDITIONS, jokerDesc, fmt, effectLabel } from './jokers.js';
import { BOSS_BY_ID } from './bosses.js';
import { Renderer, FONT, GEM_COLOR } from './render.js';
import { drawBossIcon } from './art.js';
import { DECKS, STAKES, SKINS, ACHIEVEMENTS, MISSION_BY_ID, WEEKLY_BY_ID, WEEKLY_CHEST, WEEKLY_REWARD, CALENDAR, DECK_BY_ID } from './metadata.js';
import { HANDS, HAND_KEYS, PLANET_BY_ID, GEM_CARD_BY_ID, PACK_BY_ID, VOUCHER_BY_ID } from './items.js';
import { DAILY_RULES } from './game.js';
import { levelInfo, dateKey } from './meta.js';

const $ = (sel) => document.querySelector(sel);

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

function cardCanvas(w, h) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const padd = 4;
  const c = document.createElement('canvas');
  c.width = Math.round((w + padd * 2) * dpr); c.height = Math.round((h + padd * 2) * dpr);
  c.style.width = w + padd * 2 + 'px'; c.style.height = h + padd * 2 + 'px';
  c.className = 'jcard';
  const r = new Renderer(c);
  r.dpr = dpr;
  r.ctx.scale(dpr, dpr);
  return { c, r, padd, dpr };
}

// 에디션 반짝임까지 움직이는 DOM 카드용 캔버스 (반짝임은 CSS 오버레이)
export function jokerCanvas(j, w, h, opts = {}) {
  const { c, r, padd } = cardCanvas(w, h);
  r.drawJokerCard(j, padd, padd, w, h, { ...opts, time: 0.5 });
  if (j.ed) {
    const wrap = el('div', 'jwrap ed-' + j.ed);
    wrap.appendChild(c);
    return wrap;
  }
  return c;
}

function silhouetteCanvas(w, h, locked, name = '') {
  const { c, r, padd } = cardCanvas(w, h);
  const g = r.ctx;
  g.translate(padd, padd);
  g.beginPath(); g.roundRect ? g.roundRect(0, 0, w, h, 8) : g.rect(0, 0, w, h);
  g.fillStyle = locked ? '#120a1e' : '#1d1233'; g.fill();
  g.strokeStyle = locked ? '#3a2d4f' : '#5b4a80'; g.lineWidth = 2; g.stroke();
  g.fillStyle = locked ? '#3a2d4f' : '#6f5c99';
  g.font = `900 ${Math.round(h * 0.38)}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  if (locked) {
    const cx = w / 2, cy = h * 0.45, s = Math.min(w, h) * 0.18;
    g.fillRect(cx - s, cy - s * 0.2, s * 2, s * 1.5);
    g.strokeStyle = '#3a2d4f'; g.lineWidth = s * 0.35;
    g.beginPath(); g.arc(cx, cy - s * 0.2, s * 0.65, Math.PI, 0); g.stroke();
  } else g.fillText('?', w / 2, h * 0.45);
  if (name) {
    g.fillStyle = locked ? '#8f80b8' : '#b9a8e6';
    g.font = `900 ${Math.round(h * 0.18)}px ${FONT}`;
    g.fillText(name[0] + '···', w / 2, h * 0.82);
  }
  return c;
}

// 상점 아이템(행성/보석/팩/바우처) 카드 그림
function itemCanvas(kind, id, w, h) {
  const { c, r, padd } = cardCanvas(w, h);
  const g = r.ctx;
  g.translate(padd, padd);
  const rr = (x, y, ww, hh, rad) => { g.beginPath(); g.moveTo(x + rad, y); g.arcTo(x + ww, y, x + ww, y + hh, rad); g.arcTo(x + ww, y + hh, x, y + hh, rad); g.arcTo(x, y + hh, x, y, rad); g.arcTo(x, y, x + ww, y, rad); g.closePath(); };
  let col = '#8f6bff', label = '';
  if (kind === 'planet') { const p = PLANET_BY_ID[id]; col = p.color; label = p.name; }
  else if (kind === 'gem') { const p = GEM_CARD_BY_ID[id]; col = p.color; label = p.name; }
  else if (kind === 'pack') { const p = PACK_BY_ID[id]; col = p.color; label = p.name; }
  else if (kind === 'special') { col = '#3ddc97'; label = { s_level: '줄 레벨', s_clone: '조커 복제', s_edition: '에디션' }[id]; }
  else { col = '#ffd23f'; label = VOUCHER_BY_ID[id] ? VOUCHER_BY_ID[id].name : '바우처'; }
  rr(0, 0, w, h, 8);
  const bg = g.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, kind === 'pack' ? col : '#1c1038'); bg.addColorStop(1, kind === 'pack' ? '#1c1038' : '#0b0618');
  g.fillStyle = bg; g.fill();
  g.strokeStyle = col; g.lineWidth = 2.2; g.stroke();
  const cx = w / 2, cy = h * 0.42;
  if (kind === 'planet') {
    for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect((i * 37) % w, (i * 23) % (h * 0.8), 1.5, 1.5); }
    const pr = Math.min(w, h) * 0.24;
    const pg = g.createRadialGradient(cx - pr * 0.4, cy - pr * 0.4, 2, cx, cy, pr);
    pg.addColorStop(0, '#fff'); pg.addColorStop(0.3, col); pg.addColorStop(1, '#221133');
    g.beginPath(); g.arc(cx, cy, pr, 0, Math.PI * 2); g.fillStyle = pg; g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 2;
    g.beginPath(); g.ellipse(cx, cy, pr * 1.55, pr * 0.4, -0.3, 0, Math.PI * 2); g.stroke();
  } else if (kind === 'gem') {
    r.drawGem(GEM_CARD_BY_ID[id].gem, cx, cy, Math.min(w, h) * 0.9, 0);
  } else if (kind === 'pack') {
    g.save(); g.translate(cx, cy); g.rotate(-0.12);
    for (let i = 0; i < 3; i++) {
      g.fillStyle = ['#fff', '#e6ddff', '#c9b8ff'][i];
      g.fillRect(-w * 0.2 + i * 5, -h * 0.2 + i * 3, w * 0.34, h * 0.4);
      g.strokeStyle = '#1a0d24'; g.lineWidth = 1.5; g.strokeRect(-w * 0.2 + i * 5, -h * 0.2 + i * 3, w * 0.34, h * 0.4);
    }
    g.restore();
    g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(0, h * 0.12, w, 3); g.fillRect(0, h * 0.72, w, 3);
  } else if (kind === 'special') {
    g.fillStyle = col; g.font = `900 ${Math.round(h * 0.34)}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = col; g.shadowBlur = 10;
    g.fillText(id === 's_level' ? '▲' : id === 's_clone' ? '⧉' : '✦', cx, cy);
    g.shadowBlur = 0;
  } else {
    // 티켓
    g.fillStyle = '#ffd23f';
    rr(w * 0.14, h * 0.24, w * 0.72, h * 0.34, 5); g.fill();
    g.fillStyle = '#1c1038';
    g.beginPath(); g.arc(w * 0.14, h * 0.41, 6, 0, Math.PI * 2); g.arc(w * 0.86, h * 0.41, 6, 0, Math.PI * 2); g.fill();
    g.setLineDash([3, 3]); g.strokeStyle = '#8a5a00'; g.beginPath(); g.moveTo(w * 0.62, h * 0.26); g.lineTo(w * 0.62, h * 0.56); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#5a3a00'; g.font = `900 ${Math.round(h * 0.13)}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('V', w * 0.38, h * 0.42);
  }
  g.fillStyle = '#f6ecd8'; rr(3, h - 19, w - 6, 16, 4); g.fill();
  g.fillStyle = '#2a1640'; g.font = `900 11px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(label, w / 2, h - 11, w - 8);
  return c;
}

const tokenIcon = '<i class="tok"></i>';

// 현재 빌드 기준 대략적인 기여도 (가로 1줄 제거 기준)
function estimateJoker(j, g) {
  const d = JOKER_BY_ID[j.id];
  if (!d.onScore) return d.passive ? '패시브: 규칙을 바꾸는 조커' : '점수 외 효과';
  const fake = Object.create(g);
  fake.rng = { chance: () => false, pick: (a) => a[0], int: () => 0, next: () => 0.99 };
  const ctx = { rows: [3], cols: [], lines: 1, cells: [], cellCount: 8, piece: { size: 4, tags: ['bar'], id: 'i4h' }, hand: 'row', combo: Math.max(2, g.combo + 1), lastInTray: false, firstInTray: false, gemCount: 0, goldCount: 0, hasCorner: false, edgeLines: 0, centerLines: 0, remainingAfter: 16, boardEmptyAfter: false, prevLines: 1, trayClears: 1 };
  let eff = null;
  try { eff = d.onScore(fake, { ...j }, ctx); } catch { eff = null; }
  const hv = g.handValues('row', 1);
  const base = (40 + hv.c) * hv.m;
  if (!eff || !eff.length) return `가로 1줄 기준: 조건 미충족 (조건이 맞으면 발동)`;
  let c = 40 + hv.c, m = hv.m;
  for (const e of eff) { if (e.t === 'chips') c += e.v; else if (e.t === 'mult') m += e.v; else if (e.t === 'xmult') m *= e.v; }
  const gain = Math.round(c * m - base);
  return `가로 1줄 기준 예상: ${eff.map(effectLabel).join(', ')} → 한 방 +${fmt(gain)}점`;
}

export function bossCanvas(id, size) {
  const { c, r, padd } = cardCanvas(size, size);
  c.className = 'bossic';
  drawBossIcon(r.ctx, id, padd + size / 2, padd + size / 2, size / 2 - 1);
  return c;
}

// 토큰이 카운터로 날아가는 연출
function flyTokens(fromEl, toEl, n = 6) {
  if (!fromEl || !toEl) return;
  const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
  for (let i = 0; i < n; i++) {
    const t = el('i', 'tok fly');
    const x0 = a.left + a.width / 2 + (Math.random() - 0.5) * 30, y0 = a.top + a.height / 2 + (Math.random() - 0.5) * 12;
    t.style.left = x0 + 'px'; t.style.top = y0 + 'px';
    document.body.appendChild(t);
    const dx = b.left + b.width / 2 - x0, dy = b.top + b.height / 2 - y0;
    setTimeout(() => { t.style.transform = `translate(${dx}px, ${dy}px) rotate(45deg) scale(0.7)`; t.style.opacity = '0.2'; }, 20 + i * 45);
    setTimeout(() => t.remove(), 700 + i * 45);
  }
  setTimeout(() => { toEl.classList.add('bump'); setTimeout(() => toEl.classList.remove('bump'), 300); }, 550);
}

export class UI {
  constructor(cb) {
    this.cb = cb;
    this.root = $('#ui');
    this.screens = {};
    for (const id of ['title', 'setup', 'pause', 'shop', 'over', 'victory', 'collection', 'missions', 'profile', 'settings']) {
      const s = el('div', 'screen hidden');
      s.id = 'scr-' + id;
      this.root.appendChild(s);
      this.screens[id] = s;
    }
    this.modal = el('div', 'modal hidden');
    this.root.appendChild(this.modal);
    this.tip = el('div', 'tip hidden');
    this.root.appendChild(this.tip);
    this.tip.addEventListener('pointerdown', (e) => { if (e.target === this.tip) this.hideTip(); });
    this.coach = el('div', 'coach hidden');
    this.root.appendChild(this.coach);
    this.toastBox = el('div', 'toasts');
    this.root.appendChild(this.toastBox);
    this.colTab = 'jokers';
    this.colSel = null;
  }

  // 화면을 바꿀 때 다른 화면 DOM은 비움 (id 중복 방지)
  hideAll() {
    for (const k in this.screens) { this.screens[k].classList.add('hidden'); this.screens[k].innerHTML = ''; }
    this.hideTip(); this.hideModal();
    this.current = null;
  }
  show(id) {
    for (const k in this.screens) if (k !== id) { this.screens[k].classList.add('hidden'); this.screens[k].innerHTML = ''; }
    this.hideTip();
    this.screens[id].classList.remove('hidden');
    this.current = id;
  }
  hide(id) { this.screens[id].classList.add('hidden'); this.screens[id].innerHTML = ''; if (this.current === id) this.current = null; }

  btn(label, cls, fn, id) {
    const b = el('button', 'btn ' + (cls || ''), label);
    if (id) b.id = id;
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    return b;
  }

  backBtn() { return this.btn('뒤로', 'small back', () => this.cb.toTitle(), 'btn-back'); }

  // ---------- 토스트 ----------
  toast(text, kind = 'info') {
    const t = el('div', 'toast ' + kind, text);
    this.toastBox.appendChild(t);
    while (this.toastBox.children.length > 3) this.toastBox.firstChild.remove();
    setTimeout(() => t.classList.add('out'), 2300);
    setTimeout(() => t.remove(), 2700);
  }

  // ---------- 모달 ----------
  showModal(node) {
    this.modal.innerHTML = '';
    this.modal.appendChild(node);
    this.modal.classList.remove('hidden');
  }
  hideModal() { this.modal.classList.add('hidden'); this.modal.innerHTML = ''; }
  get modalOpen() { return !this.modal.classList.contains('hidden'); }

  // ---------- 타이틀 ----------
  showTitle(meta, muted, seed) {
    const s = this.screens.title;
    const d = meta.d;
    s.innerHTML = '';
    const box = el('div', 'title-box');
    const lv = levelInfo(d.xp);
    const badges = el('div', 'badges');
    badges.innerHTML = `
      <div class="badge lv"><b>Lv.${lv.lvl}</b><span class="bar"><span style="width:${Math.round((lv.cur / lv.need) * 100)}%"></span></span></div>
      <div class="badge tk" id="title-tokens">${tokenIcon}<b>${d.tokens}</b></div>
      <div class="badge st"><span>출석</span><b>${d.streak.count}일</b></div>`;
    box.appendChild(badges);
    box.appendChild(el('div', 'logo', '<span class="l1">블록</span><span class="l2">조커</span>'));
    box.appendChild(el('div', 'sub', 'BLOCK JOKER · 블록 퍼즐 로그라이크'));
    const cards = el('div', 'title-cards');
    ['chain', 'jesterking', 'gambler'].forEach((id, i) => {
      const c = jokerCanvas({ id, v: 0, ed: i === 1 ? 'holo' : null }, 54, 70);
      c.style.transform = `rotate(${(i - 1) * 10}deg) translateY(${i === 1 ? -8 : 0}px)`;
      cards.appendChild(c);
    });
    box.appendChild(cards);

    if (d.run) {
      const r = d.run;
      const nm = r.kind === 'shop' ? '상점' : r.blind === 2 ? '보스 ' + (BOSS_BY_ID[r.boss] ? BOSS_BY_ID[r.boss].name : '') : CONFIG.BLIND_NAMES[r.blind];
      const prog = r.kind === 'play' ? ` · ${fmt(r.roundScore || 0)}/${fmt(r.target || 0)}` : '';
      box.appendChild(this.btn(`이어하기 <small>${r.opts && r.opts.daily ? '데일리 · ' : ''}앤티 ${r.ante} · ${nm}${prog}</small>`, 'big gold two', () => this.cb.continueRun(), 'btn-continue'));
    }
    box.appendChild(this.btn('새 게임', 'big' + (d.run ? '' : ' gold'), () => this.cb.setup(), 'btn-start'));
    const dl = d.daily;
    const rule = this.cb.dailyRule();
    const dailyLabel = dl.played ? `데일리 런 <small>오늘 완료 · 최고 앤티 ${dl.bestAnte || '-'}</small>` : `데일리 런 <small>오늘의 규칙: ${rule.name}</small>`;
    box.appendChild(this.btn(dailyLabel, 'daily two' + (dl.played ? ' off' : ''), () => this.cb.daily(), 'btn-daily'));
    const grid = el('div', 'menu-grid');
    const mdone = meta.missionsDone;
    const chest = meta.chestReady;
    const mPend = d.daily.missions.filter((m) => m.done && !m.claimed).length;
    grid.appendChild(this.btn(`미션 <span class="pill${mdone < 3 || chest || mPend ? ' hot' : ''}">${chest ? '상자!' : mPend ? '받기 ' + mPend : mdone + '/3'}</span>`, 'small', () => this.showMissions(meta), 'btn-missions'));
    const affordable = JOKERS.some((j) => !meta.isJokerUnlocked(j.id) && meta.jokerCost(j.id) <= d.tokens);
    grid.appendChild(this.btn(`컬렉션${affordable ? ' <span class="pill hot">NEW</span>' : ''}`, 'small', () => this.showCollection(meta), 'btn-collection'));
    const achPend = ACHIEVEMENTS.filter((a) => d.achievements[a.id] && !d.achClaimed[a.id]).length;
    grid.appendChild(this.btn(`프로필${achPend ? ` <span class="pill hot">받기 ${achPend}</span>` : ''}`, 'small', () => this.showProfile(meta), 'btn-profile'));
    grid.appendChild(this.btn('설정', 'small', () => this.showSettings(meta, muted), 'btn-settings'));
    box.appendChild(grid);
    const foot = el('div', 'row');
    foot.appendChild(this.btn('게임 방법', 'small ghost', () => this.showHelp(), 'btn-help'));
    foot.appendChild(this.btn('출석부', 'small ghost', () => this.showCalendar(meta), 'btn-calendar'));
    box.appendChild(foot);
    if (seed) box.appendChild(el('div', 'seed', `시드: ${seed}`));
    s.appendChild(box);
    this.show('title');
  }

  // ---------- 설정 ----------
  settingsBlock(settings, muted) {
    const box = el('div', 'settings');
    const slider = (label, key) => {
      const row = el('label', 'srow');
      row.innerHTML = `<span>${label}</span>`;
      const inp = el('input');
      inp.type = 'range'; inp.min = 0; inp.max = 100; inp.value = Math.round(settings[key] * 100);
      inp.id = 'set-' + key;
      inp.addEventListener('input', () => this.cb.settings({ [key]: inp.value / 100 }));
      row.appendChild(inp);
      return row;
    };
    box.appendChild(slider('배경음악', 'bgm'));
    box.appendChild(slider('효과음', 'sfx'));
    const row = el('div', 'srow');
    row.innerHTML = '<span>진동</span>';
    const vb = this.btn(settings.vib ? '켬' : '끔', 'small tog' + (settings.vib ? ' on' : ''), () => { settings.vib = !settings.vib; this.cb.settings({ vib: settings.vib }); vb.textContent = settings.vib ? '켬' : '끔'; vb.classList.toggle('on', settings.vib); }, 'set-vib');
    row.appendChild(vb);
    box.appendChild(row);
    const row2 = el('div', 'srow');
    row2.innerHTML = '<span>음소거</span>';
    row2.appendChild(this.btn(muted ? '켬' : '끔', 'small tog' + (muted ? ' on' : ''), () => this.cb.toggleMute(), 'btn-mute'));
    box.appendChild(row2);
    const row3 = el('div', 'srow');
    row3.innerHTML = '<span>점수 연출 속도</span>';
    const seg = el('div', 'seg');
    [1, 2, 4].forEach((v) => {
      const b = this.btn('x' + v, 'small' + (settings.speed === v ? ' on' : ''), () => {
        settings.speed = v; this.cb.settings({ speed: v });
        seg.querySelectorAll('.btn').forEach((x) => x.classList.toggle('on', x.textContent === 'x' + v));
      }, 'speed-' + v);
      seg.appendChild(b);
    });
    row3.appendChild(seg);
    box.appendChild(row3);
    return box;
  }

  showSettings(meta, muted) {
    const s = this.screens.settings;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', '', '설정'));
    box.appendChild(this.settingsBlock(meta.d.settings, muted));
    box.appendChild(this.backBtn());
    s.appendChild(box);
    this.show('settings');
  }

  // ---------- 새 게임 설정 (난이도 + 덱) ----------
  showSetup(meta) {
    const s = this.screens.setup;
    const d = meta.d;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', '', '새 게임'));
    const st = STAKES[d.sel.stake - 1];
    const rec = d.stakeRecords[String(st.lv)] || { bestAnte: 0, bestHit: 0, won: false };
    box.appendChild(el('div', 'label', '난이도 (스테이크)'));
    const sp = el('div', 'picker');
    sp.appendChild(this.btn('◀', 'small', () => { if (d.sel.stake > 1) { d.sel.stake--; meta.save(); this.showSetup(meta); } }, 'btn-stake-prev'));
    sp.appendChild(el('div', 'pick', `<b style="color:${st.color}">${st.name}</b><span>${st.lv}단계 · ${st.desc}</span><span class="rec">최고 앤티 ${rec.bestAnte || '-'} · 최고 한 방 ${rec.bestHit ? fmt(rec.bestHit) : '-'}${rec.won ? ' · 승리' : ''}</span>`));
    sp.appendChild(this.btn('▶', 'small', () => { if (d.sel.stake < d.stakeUnlocked) { d.sel.stake++; meta.save(); this.showSetup(meta); } }, 'btn-stake-next'));
    box.appendChild(sp);
    if (d.stakeUnlocked < STAKES.length) box.appendChild(el('div', 'hint', `승리하면 ${STAKES[d.stakeUnlocked].name} 스테이크 해금`));
    box.appendChild(el('div', 'label', '시작 덱 <small>(스티커: 그 덱으로 이긴 난이도)</small>'));
    const decks = el('div', 'deck-list');
    for (const dk of DECKS) {
      const own = d.unlocked.decks.includes(dk.id);
      const won = d.deckWins[dk.id] || 0;
      const stickers = STAKES.slice(0, won).map((x) => `<em class="stk" style="background:${x.color}" title="${x.name}"></em>`).join('');
      const it = el('button', 'deck' + (d.sel.deck === dk.id ? ' sel' : '') + (own ? '' : ' locked'));
      it.innerHTML = `<i style="background:${dk.color}"></i><b>${dk.name}<span class="stks">${stickers}</span></b><span>${own ? dk.desc : '잠김 · 컬렉션에서 ' + dk.cost + ' 토큰'}</span>`;
      it.addEventListener('click', () => { if (own) { d.sel.deck = dk.id; meta.save(); this.showSetup(meta); } else { this.colTab = 'decks'; this.showCollection(meta); } });
      decks.appendChild(it);
    }
    box.appendChild(decks);
    box.appendChild(this.btn('시작', 'big gold', () => this.cb.start(), 'btn-go'));
    box.appendChild(this.backBtn());
    s.appendChild(box);
    this.show('setup');
  }

  // ---------- 컬렉션 ----------
  showCollection(meta) {
    const s = this.screens.collection;
    const d = meta.d;
    s.innerHTML = '';
    const box = el('div', 'panel wide');
    const head = el('div', 'shop-head');
    head.appendChild(el('h2', '', '컬렉션'));
    head.appendChild(el('div', 'coins tk', `${tokenIcon}<span id="col-tokens">${d.tokens}</span>`));
    box.appendChild(head);
    const tabs = el('div', 'tabs');
    for (const [id, nm] of [['jokers', '조커 도감'], ['decks', '덱'], ['skins', '스킨']]) {
      tabs.appendChild(this.btn(nm, 'tab' + (this.colTab === id ? ' on' : ''), () => { this.colTab = id; this.colSel = null; this.showCollection(meta); }, 'tab-' + id));
    }
    box.appendChild(tabs);

    if (this.colTab === 'jokers') {
      const disc = d.discovered.length, unl = d.unlocked.jokers.length;
      box.appendChild(el('div', 'hint', `해금 ${unl}/${JOKERS.length} · 발견 ${disc}/${JOKERS.length} · 해금한 조커만 상점에 등장`));
      if (this.colSel) {
        const j = JOKER_BY_ID[this.colSel];
        const unlocked = meta.isJokerUnlocked(j.id);
        const seen = d.discovered.includes(j.id);
        const det = el('div', 'detail row-detail');
        det.appendChild(unlocked && seen ? jokerCanvas({ id: j.id, v: 0 }, 64, 80) : silhouetteCanvas(64, 80, !unlocked, j.name));
        const info = el('div', 'info');
        info.innerHTML = `<div class="nm">${unlocked && seen ? j.name : unlocked ? '미발견 조커' : j.name} <span class="rar" style="color:${RARITY_COLOR[j.rarity]}">${RARITY_LABEL[j.rarity]}</span></div><div class="ds">${j.desc({ v: 0 }, null)}</div>` +
          (unlocked ? `<div class="hint">${seen ? '발견함' : '해금됨 · 상점에서 만나면 발견'}</div>` : '');
        if (!unlocked) {
          const cost = meta.jokerCost(j.id);
          info.appendChild(this.btn(`해금 ${cost} 토큰`, 'small gold' + (d.tokens >= cost ? '' : ' off'), () => this.cb.unlock('joker', j.id), 'btn-unlock'));
        }
        det.appendChild(info);
        box.appendChild(det);
      }
      const grid = el('div', 'dex');
      for (const j of JOKERS) {
        const unlocked = meta.isJokerUnlocked(j.id);
        const seen = d.discovered.includes(j.id);
        const c = unlocked && seen ? jokerCanvas({ id: j.id, v: 0 }, 50, 62) : silhouetteCanvas(50, 62, !unlocked, j.name);
        const cell = el('div', 'dex-cell' + (this.colSel === j.id ? ' sel' : ''));
        cell.dataset.joker = j.id;
        cell.appendChild(c);
        cell.appendChild(el('div', 'dex-nm', unlocked ? (seen ? j.name : '미발견') : `${tokenIcon}${meta.jokerCost(j.id)}`));
        cell.addEventListener('click', () => { this.colSel = j.id; this.showCollection(meta); s.scrollTop = 0; });
        grid.appendChild(cell);
      }
      box.appendChild(grid);
    } else if (this.colTab === 'decks') {
      const list = el('div', 'deck-list');
      for (const dk of DECKS) {
        const own = d.unlocked.decks.includes(dk.id);
        const it = el('div', 'deck' + (own ? '' : ' locked'));
        it.innerHTML = `<i style="background:${dk.color}"></i><b>${dk.name}</b><span>${dk.desc}</span>`;
        if (!own) it.appendChild(this.btn(`${dk.cost}`, 'small gold unlock' + (d.tokens >= dk.cost ? '' : ' off'), () => this.cb.unlock('deck', dk.id)));
        else it.appendChild(el('em', '', '보유'));
        list.appendChild(it);
      }
      box.appendChild(list);
    } else {
      const list = el('div', 'deck-list');
      for (const sk of SKINS) {
        const own = d.unlocked.skins.includes(sk.id);
        const it = el('div', 'deck skin' + (own ? '' : ' locked') + (d.sel.skin === sk.id ? ' sel' : ''));
        it.innerHTML = `<i style="background:linear-gradient(135deg, ${sk.bg[0]}, ${sk.felt[0]} 60%, ${sk.trim})"></i><b>${sk.name}</b><span>${own ? (d.sel.skin === sk.id ? '사용 중' : '탭해서 적용') : '테마 스킨'}</span>`;
        if (!own) it.appendChild(this.btn(`${sk.cost}`, 'small gold unlock' + (d.tokens >= sk.cost ? '' : ' off'), () => this.cb.unlock('skin', sk.id)));
        else it.addEventListener('click', () => this.cb.skin(sk.id));
        list.appendChild(it);
      }
      box.appendChild(list);
    }
    box.appendChild(this.backBtn());
    s.appendChild(box);
    this.show('collection');
  }

  // ---------- 미션 / 데일리 ----------
  missionRow(text, p, n, reward, done, claim) {
    const it = el('div', 'mission' + (done ? ' done' : ''));
    it.innerHTML = `<div class="mt"><b>${text}</b><span>${reward != null ? tokenIcon + reward : ''}</span></div><div class="bar"><span style="width:${Math.round((Math.min(p, n) / n) * 100)}%"></span></div><div class="mp">${done ? (claim ? '' : '수령 완료') : `${fmt(Math.min(p, n))} / ${fmt(n)}`}</div>`;
    if (claim) it.querySelector('.mp').appendChild(claim);
    return it;
  }

  showMissions(meta) {
    const s = this.screens.missions;
    const d = meta.d;
    s.innerHTML = '';
    const box = el('div', 'panel');
    const mh = el('div', 'shop-head');
    mh.appendChild(el('h2', '', '미션'));
    mh.appendChild(el('div', 'coins tk', `${tokenIcon}<span class="tokc">${d.tokens}</span>`));
    box.appendChild(mh);
    this.claimAllBtn(box, meta, () => this.showMissions(meta));
    const now = new Date();
    const mid = new Date(now); mid.setHours(24, 0, 0, 0);
    const left = Math.max(0, mid - now);
    box.appendChild(el('div', 'label', `오늘의 미션 <small>자정까지 ${Math.floor(left / 3600000)}시간 ${Math.floor((left % 3600000) / 60000)}분</small>`));
    const list = el('div', 'missions');
    d.daily.missions.forEach((m, i) => {
      const def = MISSION_BY_ID[m.id];
      let claim = null;
      if (m.done && !m.claimed) {
        claim = this.btn('받기', 'small gold claim', () => {
          const r = this.cb.claimMission(i);
          if (!r) return;
          const cnt = box.querySelector('.tokc');
          flyTokens(claim, cnt);
          claim.disabled = true; claim.textContent = `+${r}`;
          setTimeout(() => { if (cnt) cnt.textContent = d.tokens; }, 600);
          setTimeout(() => this.showMissions(meta), 900);
        }, 'claim-m-' + i);
      }
      list.appendChild(this.missionRow(def.text(m.n), m.p, m.n, def.reward, m.done, claim));
    });
    box.appendChild(list);
    box.appendChild(el('div', 'label', `주간 미션 <small>3개 완료 시 주간 상자 ${WEEKLY_CHEST} 토큰</small>`));
    const wl = el('div', 'missions');
    d.weekly.missions.forEach((m, i) => {
      const def = WEEKLY_BY_ID[m.id];
      let claim = null;
      if (m.done && !m.claimed) {
        claim = this.btn('받기', 'small gold claim', () => {
          const r = this.cb.claimMission(i, true);
          if (!r) return;
          const cnt = box.querySelector('.tokc');
          flyTokens(claim, cnt);
          claim.disabled = true; claim.textContent = `+${r}`;
          setTimeout(() => { if (cnt) cnt.textContent = d.tokens; }, 600);
          setTimeout(() => this.showMissions(meta), 900);
        }, 'claim-w-' + i);
      }
      wl.appendChild(this.missionRow(def.text(m.n), m.p, m.n, WEEKLY_REWARD, m.done, claim));
    });
    box.appendChild(wl);
    const chestBtn = this.btn(d.weekly.chest ? '주간 상자 수령함' : meta.chestReady ? '주간 상자 열기!' : `주간 상자 (${meta.weeklyDone}/3)`, (meta.chestReady ? 'gold chest' : 'off'), () => {
      const r = this.cb.claimChest();
      if (r) { flyTokens(chestBtn, box.querySelector('.tokc'), 10); this.toast(`주간 상자 +${r} 토큰`, 'ach'); setTimeout(() => this.showMissions(meta), 900); }
    }, 'btn-chest');
    box.appendChild(chestBtn);

    // 데일리 런
    const rule = this.cb.dailyRule();
    box.appendChild(el('div', 'label', `데일리 런 <small>오늘의 규칙: ${rule.name} (${rule.desc})</small>`));
    const hist = el('div', 'dhist');
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(today); dt.setDate(dt.getDate() - i);
      const k = dateKey(dt);
      const h = d.dailyHistory[k];
      const cell = el('div', 'dh' + (h ? (h.won ? ' won' : ' played') : '') + (i === 0 ? ' today' : ''));
      cell.innerHTML = `<span>${dt.getMonth() + 1}/${dt.getDate()}</span><b>${h ? '앤티 ' + h.ante : '-'}</b><em>${h && h.hit ? fmt(h.hit) : ''}</em>`;
      hist.appendChild(cell);
    }
    box.appendChild(hist);
    box.appendChild(this.backBtn());
    s.appendChild(box);
    this.show('missions');
  }

  claimAllBtn(box, meta, rerender) {
    const n = meta.claimables;
    if (!n) return;
    const b = this.btn(`모두 받기 (${n})`, 'gold claimall', () => {
      const r = this.cb.claimAll();
      if (!r) return;
      const cnt = box.querySelector('.tokc');
      flyTokens(b, cnt, 10);
      b.disabled = true; b.textContent = `+${r} 토큰`;
      setTimeout(() => { if (cnt) cnt.textContent = meta.d.tokens; }, 600);
      setTimeout(rerender, 950);
    }, 'btn-claim-all');
    box.appendChild(b);
  }

  // ---------- 막힘 구제 ----------
  showRescue(g) {
    const box = el('div', 'panel rescue');
    box.appendChild(el('h2', 'over', '놓을 곳이 없음!'));
    box.appendChild(el('p', 'reason', '런당 1번, 막힘 구제로 가장 꽉 찬 가로줄 3개를 즉시 비울 수 있음 (점수 없음)'));
    const can = g.coins >= CONFIG.RESCUE_COST;
    box.appendChild(this.btn(`$${CONFIG.RESCUE_COST} 내고 구제`, 'gold' + (can ? '' : ' off'), () => { if (!can) return; this.hideModal(); this.cb.rescue('coins'); }, 'rescue-coins'));
    if (g.jokers.length) {
      box.appendChild(el('div', 'label', '또는 조커 1장 희생'));
      const row = el('div', 'choices');
      g.jokers.forEach((j, i) => row.appendChild(this.btn(JOKER_BY_ID[j.id].name, 'small', () => { this.hideModal(); this.cb.rescue('joker', i); }, 'rescue-j' + i)));
      box.appendChild(row);
    }
    box.appendChild(this.btn('포기 (게임 오버)', 'red', () => { this.hideModal(); this.cb.rescue('decline'); }, 'rescue-decline'));
    this.showModal(box);
  }

  // 첫 라운드 전 안내 카드
  showTrayCard() {
    const box = el('div', 'panel traycard');
    box.appendChild(el('h2', '', '트레이 = 라운드의 수명'));
    const row = el('div', 'trayrow');
    for (let i = 0; i < 6; i++) row.appendChild(el('i', i < 5 ? 'on' : ''));
    box.appendChild(row);
    box.appendChild(el('p', 'reason', '조각 3개가 트레이 1개. 라운드마다 트레이 6개 안에 목표 점수를 넘기면 클리어.'));
    box.appendChild(el('p', 'reason', '<b style="color:#ff8fa3">놓을 곳이 없으면 패배.</b> 막히면 아래 <b style="color:#ffe68a">↻ 트레이 교체</b>(라운드마다 2번)로 조각을 바꿀 것.'));
    box.appendChild(this.btn('시작!', 'big gold', () => { this.hideModal(); this.cb.coachDone('tray'); }, 'tray-ok'));
    this.showModal(box);
  }

  // ---------- 출석 캘린더 ----------
  showCalendar(meta) {
    const d = meta.d;
    const box = el('div', 'panel cal');
    box.appendChild(el('h2', '', '출석부'));
    const claimable = meta.calendarClaimable;
    const day = meta.calendarDay();
    box.appendChild(el('div', 'hint', claimable ? `연속 출석 ${meta.nextStreak()}일째! 오늘의 보상을 받을 것` : `오늘은 수령 완료 · 연속 ${d.streak.count}일`));
    const grid = el('div', 'calgrid');
    CALENDAR.forEach((r, i) => {
      const n = i + 1;
      const got = n < day || (!claimable && n === day);
      const cell = el('div', 'calcell' + (n === 7 ? ' big' : '') + (got ? ' got' : '') + (claimable && n === day ? ' now' : ''));
      cell.innerHTML = `<span>${n}일</span><b>${tokenIcon}${r}</b>${got ? '<em>받음</em>' : ''}`;
      grid.appendChild(cell);
    });
    box.appendChild(grid);
    box.appendChild(el('div', 'hint', '하루라도 빠지면 1일부터 다시 시작. 7일차는 대형 보상'));
    if (claimable) {
      box.appendChild(this.btn('보상 받기', 'big gold', () => {
        const r = this.cb.claimCalendar();
        const now = grid.querySelector('.now');
        if (now) { now.classList.add('pop', 'got'); now.insertAdjacentHTML('beforeend', '<em>받음</em>'); }
        this.toast(`출석 보상 +${r} 토큰`, 'token');
        setTimeout(() => { this.hideModal(); if (this.current === 'title') this.cb.toTitle(); }, 900);
      }, 'btn-claim'));
    } else box.appendChild(this.btn('닫기', '', () => this.hideModal(), 'btn-cal-close'));
    this.showModal(box);
  }

  // ---------- 프로필 ----------
  showProfile(meta) {
    const s = this.screens.profile;
    const d = meta.d;
    const st = d.stats;
    s.innerHTML = '';
    const box = el('div', 'panel wide');
    const lv = levelInfo(d.xp);
    const ph = el('div', 'shop-head');
    ph.appendChild(el('h2', '', `프로필 <small>Lv.${lv.lvl}</small>`));
    ph.appendChild(el('div', 'coins tk', `${tokenIcon}<span class="tokc">${d.tokens}</span>`));
    box.appendChild(ph);
    this.claimAllBtn(box, meta, () => this.showProfile(meta));
    box.appendChild(el('div', 'xpbar', `<span style="width:${Math.round((lv.cur / lv.need) * 100)}%"></span><em>${lv.cur} / ${lv.need} XP</em>`));
    const t = el('div', 'stats two');
    const rows = [
      ['총 플레이', st.runs], ['승리', st.wins], ['최고 앤티', st.bestAnte || '-'], ['최고 한 방', fmt(st.bestHit)],
      ['최고 라운드', fmt(st.bestRoundScore)], ['제거한 줄', fmt(st.totalLines)], ['클리어 라운드', st.roundsCleared], ['보스 격파', st.bossesBeaten],
      ['보석 제거', st.gemsCleared], ['조커 구매', st.jokersBought], ['최대 콤보', st.maxCombo], ['데일리 런', st.dailyRuns],
      ['누적 토큰', st.tokensEarned], ['최장 출석', st.bestStreak + '일'],
    ];
    t.innerHTML = rows.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('');
    box.appendChild(t);
    box.appendChild(el('div', 'label', '난이도별 기록'));
    const sr = el('div', 'stats');
    sr.innerHTML = STAKES.map((sk) => {
      const r = d.stakeRecords[String(sk.lv)];
      const lock = sk.lv > d.stakeUnlocked;
      return `<div><span style="color:${sk.color}">${sk.name}${lock ? ' (잠김)' : ''}</span><b>${r ? `앤티 ${r.bestAnte} · ${fmt(r.bestHit)}${r.won ? ' · 승리' : ''}` : '-'}</b></div>`;
    }).join('') + (d.stakeRecords.daily ? `<div><span>데일리</span><b>앤티 ${d.stakeRecords.daily.bestAnte} · ${fmt(d.stakeRecords.daily.bestHit)}</b></div>` : '');
    box.appendChild(sr);
    box.appendChild(el('div', 'label', '덱 승리 스티커'));
    const dw = el('div', 'stats');
    dw.innerHTML = DECKS.map((dk) => `<div><span>${dk.name}</span><b>${STAKES.map((x) => `<em class="stk${(d.deckWins[dk.id] || 0) >= x.lv ? '' : ' no'}" style="background:${x.color}"></em>`).join('')}</b></div>`).join('');
    box.appendChild(dw);
    const got = ACHIEVEMENTS.filter((a) => d.achievements[a.id]).length;
    box.appendChild(el('div', 'label', `업적 ${got}/${ACHIEVEMENTS.length}`));
    const al = el('div', 'achs');
    const sorted = ACHIEVEMENTS.slice().sort((x, y) => ((d.achievements[y.id] && !d.achClaimed[y.id]) ? 1 : 0) - ((d.achievements[x.id] && !d.achClaimed[x.id]) ? 1 : 0));
    for (const a of sorted) {
      const ok = !!d.achievements[a.id];
      const pend = ok && !d.achClaimed[a.id];
      const it = el('div', 'ach' + (ok ? ' ok' : ''), `<b>${a.name}</b><span>${a.desc}</span><em>${ok ? (pend ? '' : '수령 완료') : tokenIcon + a.reward}</em>`);
      if (pend) {
        const cb2 = this.btn(`받기 ${a.reward}`, 'small gold claim', () => {
          const r = this.cb.claimAchievement(a.id);
          if (!r) return;
          const cnt = box.querySelector('.tokc');
          flyTokens(cb2, cnt);
          cb2.disabled = true;
          setTimeout(() => { if (cnt) cnt.textContent = d.tokens; }, 600);
          setTimeout(() => { const st2 = s.scrollTop; this.showProfile(meta); s.scrollTop = st2; }, 900);
        }, 'claim-a-' + a.id);
        it.querySelector('em').appendChild(cb2);
      }
      al.appendChild(it);
    }
    box.appendChild(al);
    box.appendChild(this.backBtn());
    s.appendChild(box);
    this.show('profile');
  }

  // ---------- 도움말 (그림 4페이지, 스와이프) ----------
  helpPicture(page) {
    const W = 260, H = 130;
    const { c, r, padd } = cardCanvas(W, H);
    c.className = 'helppic';
    const g = r.ctx;
    g.translate(padd, padd);
    g.fillStyle = '#0d3b2a'; g.fillRect(0, 0, W, H);
    const cell = 16;
    if (page === 0) {
      // 8x8 보드
      const c8 = 14.5, bx = 10, by = 7;
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { g.fillStyle = (x + y) % 2 ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.4)'; g.fillRect(bx + x * c8 + 1, by + y * c8 + 1, c8 - 2, c8 - 2); }
      for (let x = 0; x < 7; x++) r.drawBlock(x % 3, bx + x * c8, by + 6 * c8, c8);
      [[5, 2], [5, 3], [6, 3], [0, 5], [1, 5], [7, 7], [6, 7]].forEach(([x, y], k) => r.drawBlock(k % 5, bx + x * c8, by + y * c8, c8));
      g.fillStyle = 'rgba(255,255,255,0.45)'; g.fillRect(bx, by + 6 * c8, 8 * c8, c8);
      r.drawBlock(4, bx + 7 * c8, by + 4 * c8, c8, 0.4); r.drawBlock(4, bx + 7 * c8, by + 5 * c8, c8, 0.4); r.drawBlock(4, bx + 7 * c8, by + 6 * c8, c8, 0.4);
      for (let k = 0; k < 3; k++) r.drawBlock(4, 196, 18 + k * cell, cell);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(204, 96, 12, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#ffd23f'; g.lineWidth = 3; g.setLineDash([5, 4]); g.beginPath(); g.moveTo(186, 60); g.quadraticCurveTo(160, 20, 136, 62); g.stroke(); g.setLineDash([]);
    } else if (page === 1) {
      const box = (x, col, t) => { g.fillStyle = col; g.fillRect(x, 40, 90, 44); g.fillStyle = '#fff'; g.font = `900 22px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, x + 45, 62); };
      box(12, '#1a7fe0', '50 칩'); box(158, '#e0304f', 'x 3');
      g.fillStyle = '#fff'; g.font = `900 22px ${FONT}`; g.textAlign = 'center'; g.fillText('X', 130, 62);
      g.fillStyle = '#ffe68a'; g.font = `900 18px ${FONT}`; g.fillText('= 150점', 130, 108);
      g.fillStyle = '#b9a8e6'; g.font = `800 11px ${FONT}`; g.fillText('칩: 칸 수 + 줄 종류 / 배수: 줄 종류 + 콤보', 130, 20, W - 12);
    } else if (page === 2) {
      const items = [['스몰', '#36c9ff'], ['빅', '#ffb627'], ['보스', '#ff4d6d'], ['상점', '#3ddc97']];
      items.forEach(([t, col], i) => {
        const x = 12 + i * 62;
        g.fillStyle = col; g.beginPath(); g.arc(x + 24, 55, 24, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#1a0d24'; g.font = `900 13px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, x + 24, 55);
        if (i < 3) { g.fillStyle = '#fff'; g.fillText('›', x + 55, 55); }
      });
      g.fillStyle = '#e6ddff'; g.font = `800 12px ${FONT}`; g.textAlign = 'center';
      g.fillText('트레이 6번 안에 목표 점수 달성', 130, 100);
      g.fillText('앤티 1~8, 앤티 8 쇼다운 보스를 이기면 승리', 130, 118);
    } else {
      r.drawJokerCard({ id: 'rower', v: 0 }, 14, 16, 58, 74, { time: 0 });
      r.drawJokerCard({ id: 'cross', v: 0, ed: 'foil' }, 80, 16, 58, 74, { time: 0.4 });
      ['gold', 'ruby', 'glass', 'steel'].forEach((gm, i) => r.drawGem(gm, 170 + (i % 2) * 40, 34 + Math.floor(i / 2) * 40, 40, 0));
      g.fillStyle = '#e6ddff'; g.font = `800 11px ${FONT}`; g.textAlign = 'center'; g.fillText('조커는 왼쪽부터 발동', 76, 112); g.fillText('보석은 줄과 함께 발동', 190, 112);
    }
    return c;
  }

  showHelp(start = 0) {
    const pages = [
      { t: '1. 조각 놓기', p: '트레이의 조각을 끌어 8x8 보드에 놓기. 가로 또는 세로 한 줄을 꽉 채우면 사라짐. 조각은 회전하지 않음.' },
      { t: '2. 칩 X 배수', p: '줄을 지우면 <b class="c">칩</b> X <b class="m">배수</b> 만큼 점수. 여러 줄을 한 번에, 연속으로(콤보) 지울수록 배수가 커짐. 연출 중에도 계속 놓을 수 있고, 빈 곳을 탭하면 연출 스킵.' },
      { t: '3. 라운드와 상점', p: '라운드마다 트레이(조각 3개 묶음) 수가 정해져 있음. 목표 점수를 넘기면 클리어하고 상점으로. 남은 트레이와 이자만큼 코인을 더 받음.' },
      { t: '4. 조커, 카드, 보석', p: '조커는 점수 규칙을 바꾸는 카드. 줄 강화 카드로 줄 종류 레벨업, 보석 카드로 다음 조각에 보석 박기. 보스는 저주를 거니 설명을 꼭 확인할 것.' },
    ];
    let i = start;
    const box = el('div', 'panel help');
    const track = el('div', 'htrack');
    pages.forEach((pg, k) => {
      const page = el('div', 'hpage');
      page.appendChild(el('h3', '', pg.t));
      page.appendChild(this.helpPicture(k));
      page.appendChild(el('p', '', pg.p));
      track.appendChild(page);
    });
    const vp = el('div', 'hview');
    vp.appendChild(track);
    box.appendChild(vp);
    const dots = el('div', 'dots');
    pages.forEach(() => dots.appendChild(el('i')));
    box.appendChild(dots);
    const nav = el('div', 'row');
    const prev = this.btn('이전', 'small', () => go(i - 1), 'help-prev');
    const next = this.btn('다음', 'small gold', () => { if (i >= pages.length - 1) this.hideModal(); else go(i + 1); }, 'help-next');
    nav.appendChild(prev); nav.appendChild(next);
    box.appendChild(nav);
    const go = (k) => {
      i = Math.max(0, Math.min(pages.length - 1, k));
      track.style.transform = `translateX(${-i * 100}%)`;
      [...dots.children].forEach((d, n) => d.classList.toggle('on', n === i));
      next.textContent = i === pages.length - 1 ? '시작!' : '다음';
      prev.classList.toggle('off', i === 0);
    };
    // 스와이프
    let sx = null;
    vp.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    vp.addEventListener('pointerup', (e) => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); });
    go(i);
    this.showModal(box);
  }

  // ---------- 코치 마크 ----------
  showCoach(id, rects = {}) {
    const c = this.coach;
    c.innerHTML = '';
    c.dataset.id = id;
    let html = '';
    if (id === 'calc') {
      const r = rects.calc;
      const hole = el('div', 'hole');
      Object.assign(hole.style, { left: r.x - 6 + 'px', top: r.y - 20 + 'px', width: r.w + 12 + 'px', height: r.h + 26 + 'px' });
      c.appendChild(hole);
      html = `<h3>점수 = <b class="c">칩</b> X <b class="m">배수</b></h3>
        <p><b class="c">칩</b>: 지운 칸 수 x 5 + 줄 종류 보너스</p>
        <p><b class="m">배수</b>: 줄 종류(가로, 세로, 더블, 멀티, 십자) + 콤보</p>
        <p>한 번에 여러 줄, 연달아 지우면 배수가 쑥쑥 오름. 조커와 보석이 여기에 더하고 곱함.</p>`;
      if (rects.vals) {
        const v = rects.vals;
        html = `<div class="coach-vals"><span class="cv c">${fmt(v.chips)}</span><b>X</b><span class="cv m">${Number.isInteger(v.mult) ? v.mult : v.mult.toFixed(1)}</span><b>=</b><span class="cv t">${fmt(v.total)}</span></div><div class="dim">방금 ${HANDS[v.hand].name} 제거 점수</div>` + html;
      }
      const tipBox = el('div', 'coach-box', html);
      tipBox.style.top = r.y + r.h + 18 + 'px';
      c.appendChild(tipBox);
    } else if (id === 'shop') {
      html = `<h3>조커는 왼쪽부터 순서대로 발동</h3>
        <div class="demo"><div class="dc a">+4 배수</div><div class="dc b">x2 배수</div></div>
        <p class="demo-f"><span class="f1">(1 + 4) x 2 = <b>10</b></span><span class="f2">1 x 2 + 4 = <b>6</b></span></p>
        <p>더하기 조커를 왼쪽, 곱하기 조커를 오른쪽에 두면 점수가 커짐. 내 조커 카드를 끌어서 순서 변경.</p>
        <p>남는 코인은 줄 강화 카드, 팩, 바우처에 투자할 것. $5마다 이자 $1.</p>`;
      const tipBox = el('div', 'coach-box center', html);
      c.appendChild(tipBox);
    }
    const ok = this.btn('알겠음', 'gold', () => { this.hideCoach(); this.cb.coachDone(id); }, 'coach-ok');
    c.querySelector('.coach-box').appendChild(ok);
    c.classList.remove('hidden');
  }
  hideCoach() { this.coach.classList.add('hidden'); this.coach.innerHTML = ''; }
  get coachOpen() { return !this.coach.classList.contains('hidden'); }

  // ---------- 보스 저주 카드 ----------
  showBossCard(g) {
    const b = BOSS_BY_ID[g.boss];
    const box = el('div', 'panel bosscard');
    box.style.borderColor = b.color;
    box.appendChild(el('div', 'bk', b.showdown ? '쇼다운 보스' : '보스 블라인드'));
    box.appendChild(el('h2', '', `<span style="color:${b.color}">${b.name}</span>`));
    const sigil = el('div', 'sigil');
    sigil.style.background = `radial-gradient(circle, ${b.color}88 0%, transparent 70%)`;
    sigil.appendChild(bossCanvas(g.boss, 96));
    box.appendChild(sigil);
    box.appendChild(el('div', 'curse big', `저주: ${b.desc}`));
    box.appendChild(el('div', 'hint', `목표 ${fmt(g.target)} (보통의 2배) · 클리어 보상 $${CONFIG.BLIND_REWARD[2]}`));
    box.appendChild(el('p', 'dim', '저주는 이 라운드에만 걸림. 라운드 이름을 탭하면 언제든 다시 볼 수 있음.'));
    box.appendChild(this.btn('도전!', 'big gold', () => { this.hideModal(); this.cb.coachDone('boss:' + g.boss); }, 'boss-ok'));
    this.showModal(box);
  }

  // ---------- 일시정지 ----------
  showPause(settings, muted) {
    const s = this.screens.pause;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', '', '일시정지'));
    box.appendChild(this.btn('계속하기', 'big gold', () => this.cb.resume(), 'btn-resume'));
    box.appendChild(this.settingsBlock(settings, muted));
    box.appendChild(this.btn('게임 방법', 'small ghost', () => this.showHelp()));
    box.appendChild(this.btn('타이틀로 (이어하기 저장)', '', () => this.cb.toTitle(), 'btn-pause-title'));
    box.appendChild(this.btn('런 포기', 'red', () => this.confirm('정말 포기할까?', '이번 런의 진행과 보상(토큰, 경험치)이 모두 사라짐.', '포기하기', () => this.cb.abandon(), 'btn-abandon-ok'), 'btn-abandon'));
    s.appendChild(box);
    this.show('pause');
  }

  confirm(title, desc, okLabel, onOk, okId) {
    const box = el('div', 'panel confirm');
    box.appendChild(el('h2', 'over', title));
    box.appendChild(el('p', 'reason', desc));
    const row = el('div', 'row');
    row.appendChild(this.btn('취소', '', () => this.hideModal(), 'confirm-cancel'));
    row.appendChild(this.btn(okLabel, 'red', () => { this.hideModal(); onOk(); }, okId));
    box.appendChild(row);
    this.showModal(box);
  }

  // ---------- 상점 ----------
  tile(canvas, price, can, sold, onTap, cls = '', tag = '') {
    const t = el('button', 'tile ' + cls + (sold ? ' sold' : '') + (can ? '' : ' cant'));
    t.appendChild(canvas);
    if (tag) t.appendChild(el('span', 'ttag', tag));
    t.appendChild(el('span', 'price', sold ? '구매함' : `$${price}`));
    t.addEventListener('click', (e) => { e.stopPropagation(); if (!sold) onTap(); });
    return t;
  }

  itemPopover(title, sub, desc, buyLabel, can, onBuy, extra) {
    this.tip.innerHTML = '';
    const b = el('div', 'tip-box pop');
    b.innerHTML = `<h3>${title}</h3>${sub ? `<div class="sub2">${sub}</div>` : ''}<p>${desc}</p>`;
    if (extra) b.appendChild(extra);
    const row = el('div', 'row');
    if (onBuy) row.appendChild(this.btn(buyLabel, 'gold' + (can ? '' : ' off'), () => { this.hideTip(); onBuy(); }, 'pop-buy'));
    row.appendChild(this.btn('닫기', '', () => this.hideTip(), 'pop-close'));
    b.appendChild(row);
    this.tip.appendChild(b);
    this.tip.classList.remove('hidden');
  }

  showShop(g) {
    const s = this.screens.shop;
    const scroll = s.scrollTop;
    s.innerHTML = '';
    const box = el('div', 'panel shop');
    const rw = g.rewards;
    if (rw) {
      box.appendChild(el('h2', 'clear', '라운드 클리어!'));
      const parts = [`블라인드 $${rw.base}`];
      if (rw.handsLeft) parts.push(`남은 트레이 ${rw.handsLeft} x $${CONFIG.COIN_PER_HAND}`);
      if (rw.swapsLeft) parts.push(`남은 교체 ${rw.swapsLeft} x $1`);
      if (rw.interest) parts.push(`이자 $${rw.interest}`);
      if (rw.jokerCoins) parts.push(`조커 $${rw.jokerCoins}`);
      box.appendChild(el('div', 'reward', parts.join(' · ') + ` <b>+$${rw.total}</b>`));
    } else box.appendChild(el('h2', 'clear', '상점'));
    const head = el('div', 'shop-head');
    head.appendChild(el('div', 'coins', `<i></i>$${g.coins}`));
    head.appendChild(this.btn(`리롤 $${g.rerollCost}`, 'small' + (g.coins >= g.rerollCost ? '' : ' off'), () => this.cb.reroll(), 'btn-reroll'));
    box.appendChild(head);

    // 보유 조커 (끌어서 순서 변경, 탭하면 판매)
    box.appendChild(el('div', 'label', `내 조커 ${g.jokers.length}/${g.jokerSlots} <small>끌어서 순서 변경 · 탭: 판매</small>`));
    const own = el('div', 'owned drag');
    for (let i = 0; i < Math.max(g.jokerSlots, g.jokers.length); i++) {
      const j = g.jokers[i];
      if (!j) { own.appendChild(el('div', 'slot-empty')); continue; }
      const c = jokerCanvas(j, 52, 66);
      const wrap = el('div', 'ownj');
      wrap.dataset.idx = i;
      wrap.appendChild(c);
      own.appendChild(wrap);
    }
    this.bindReorder(own, g);
    box.appendChild(own);

    const sh = g.shop;
    box.appendChild(el('div', 'label', '조커 <small>탭해서 보기</small>'));
    const jr = el('div', 'tiles');
    const full = g.jokers.length >= g.jokerSlots;
    sh.jokers.forEach((o, i) => {
      const d = JOKER_BY_ID[o.id];
      const can = g.coins >= o.price && (!full || o.ed === 'neg');
      const t = this.tile(jokerCanvas({ id: o.id, v: 0, ed: o.ed }, 58, 74), o.price, can, o.sold, () => {
        const art = el('div', 'bigart');
        art.appendChild(jokerCanvas({ id: o.id, v: 0, ed: o.ed }, 96, 122));
        art.appendChild(el('div', 'est', estimateJoker(o, g)));
        const lab = full && o.ed !== 'neg' ? '슬롯 가득: 판매 후 구매' : g.coins < o.price ? `코인 부족 ($${o.price})` : `구매 $${o.price}`;
        this.itemPopover(`${d.name} <span class="rar" style="color:${RARITY_COLOR[d.rarity]}">${RARITY_LABEL[d.rarity]}</span>`, o.ed ? `<span style="color:${EDITIONS[o.ed].color}">${EDITIONS[o.ed].name} 에디션: ${EDITIONS[o.ed].desc}</span>` : '', d.desc({ v: 0 }, g), lab, can, () => this.cb.buyJoker(i), art);
      }, 'jt', o.isNew ? 'NEW' : '');
      t.dataset.offer = i;
      t.dataset.joker = o.id;
      jr.appendChild(t);
    });
    box.appendChild(jr);

    box.appendChild(el('div', 'label', '카드 · 팩 · 바우처'));
    const cr = el('div', 'tiles hscroll');
    sh.cards.forEach((o, i) => {
      const can = g.coins >= o.price;
      let title, desc;
      if (o.kind === 'planet') {
        const p = PLANET_BY_ID[o.id]; const h = HANDS[p.hand]; const lv = g.lineLv[p.hand];
        title = `${p.name} · ${h.name} 강화`;
        const up = g.hasVoucher('v_telescope') ? 2 : 1;
        desc = `${h.name} Lv.${lv} → ${lv + up}: +${h.lc * up} 칩 +${h.lm * up} 배수`;
      } else { const p = GEM_CARD_BY_ID[o.id]; title = p.name; desc = p.desc; }
      const t = this.tile(itemCanvas(o.kind, o.id, 58, 74), o.price, can, o.sold, () => this.itemPopover(title, o.kind === 'planet' ? '줄 강화 카드' : '보석 부여 카드', desc, `사용 $${o.price}`, can, () => this.cb.buyCard(i)), 'ct');
      t.dataset.card = i;
      cr.appendChild(t);
    });
    sh.packs.forEach((o, i) => {
      const p = PACK_BY_ID[o.id];
      const can = g.coins >= o.price;
      const t = this.tile(itemCanvas('pack', o.id, 58, 74), o.price, can, o.sold, () => this.itemPopover(p.name, '부스터 팩', p.desc, `열기 $${o.price}`, can, () => this.cb.buyPack(i)), 'pt');
      t.dataset.pack = i;
      cr.appendChild(t);
    });
    const vo = g.voucherOffer;
    if (vo) {
      const v = VOUCHER_BY_ID[vo.id];
      const can = g.coins >= vo.price;
      const t = this.tile(itemCanvas('voucher', vo.id, 58, 74), vo.price, can, vo.sold, () => this.itemPopover(v.name, '바우처 · 앤티당 1장, 런 끝까지 유지', v.desc, `구매 $${vo.price}`, can, () => this.cb.buyVoucher()), 'vt');
      t.id = 'tile-voucher';
      cr.appendChild(t);
    }
    const sp = sh.special;
    if (sp) {
      const names = { s_level: ['줄 레벨 선택', '원하는 줄 종류 레벨 +1'], s_clone: ['조커 복제', '보유 조커 1장을 그대로 복제 (슬롯 필요)'], s_edition: ['에디션 부여', '에디션 없는 조커 1장에 포일/홀로/폴리크롬 중 하나'] };
      const [nmS, dsS] = names[sp.id];
      const can = g.coins >= sp.price;
      const extra = el('div', 'choices');
      if (sp.id === 's_level') {
        HAND_KEYS.forEach((k) => extra.appendChild(this.btn(`${HANDS[k].name} ${g.lineLv[k]}→${g.lineLv[k] + (g.hasVoucher('v_telescope') ? 2 : 1)}`, 'small' + (can ? '' : ' off'), () => { this.hideTip(); this.cb.buySpecial(k); }, 'sp-' + k)));
      } else {
        g.jokers.forEach((j, i) => {
          const ok = sp.id === 's_clone' ? g.jokers.length < g.jokerSlots : !j.ed;
          extra.appendChild(this.btn(JOKER_BY_ID[j.id].name, 'small' + (can && ok ? '' : ' off'), () => { if (!ok) return; this.hideTip(); this.cb.buySpecial(i); }, 'sp-j' + i));
        });
        if (!g.jokers.length) extra.appendChild(el('p', 'dim', '보유한 조커가 없음'));
      }
      const t = this.tile(itemCanvas('special', sp.id, 58, 74), sp.price, can, sp.sold, () => this.itemPopover(nmS, `특수 서비스 · $${sp.price}`, dsS + ' · 대상을 골라 구매', null, can, null, extra), 'st');
      t.id = 'tile-special';
      cr.appendChild(t);
    }
    box.appendChild(cr);

    // 줄 레벨
    const lvs = el('div', 'lvrow');
    lvs.innerHTML = HAND_KEYS.map((k) => `<span class="${g.lineLv[k] > 1 ? 'up' : ''}">${HANDS[k].name} <b>${g.lineLv[k]}</b></span>`).join('') +
      (g.vouchers.length ? `<span class="vch">바우처 ${g.vouchers.length}</span>` : '') + (g.pendingGems.length ? `<span class="vch">보석 대기 ${g.pendingGems.length}</span>` : '');
    box.appendChild(lvs);

    const boss = g.blind === 2;
    const bd = BOSS_BY_ID[g.boss];
    const nm = boss ? bd.name : CONFIG.BLIND_NAMES[g.blind];
    const next = el('div', 'next' + (boss ? ' boss' : ''));
    next.innerHTML = `<div>다음: 앤티 ${g.ante} · <b>${nm}</b> · 목표 ${fmt(g.targetOf(g.ante, g.blind))}</div>` + (boss ? `<div class="curse">저주: ${bd.desc}</div>` : `<div class="dim">이번 앤티 보스: ${bd.name} (${bd.desc})</div>`);
    const bi = bossCanvas(g.boss, 34);
    next.prepend(bi);
    box.appendChild(next);
    const nb = el('div', 'next-bar');
    nb.appendChild(this.btn('다음 라운드', 'big gold', () => this.cb.next(), 'btn-next'));
    s.appendChild(box);
    s.appendChild(nb);
    this.show('shop');
    s.scrollTop = scroll;
    if (g.packOpen) this.showPack(g); else this.hideModal();
  }

  // 조커 순서 드래그 (포인터)
  bindReorder(own, g) {
    let drag = null;
    own.addEventListener('pointerdown', (e) => {
      const w = e.target.closest('.ownj');
      if (!w) return;
      drag = { el: w, idx: +w.dataset.idx, x0: e.clientX, moved: false };
      try { w.setPointerCapture(e.pointerId); } catch { /* 무시 */ }
    });
    own.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x0;
      if (Math.abs(dx) > 8) drag.moved = true;
      if (drag.moved) { drag.el.style.transform = `translateX(${dx}px) scale(1.08)`; drag.el.style.zIndex = 3; }
    });
    const end = (e) => {
      if (!drag) return;
      const d = drag; drag = null;
      d.el.style.transform = ''; d.el.style.zIndex = '';
      if (!d.moved) { this.ownedPopover(g, d.idx); return; }
      const items = [...own.querySelectorAll('.ownj')];
      let to = d.idx;
      items.forEach((it) => { const r = it.getBoundingClientRect(); if (e.clientX > r.left + r.width / 2) to = Math.max(to, +it.dataset.idx); });
      let min = d.idx;
      items.forEach((it) => { const r = it.getBoundingClientRect(); if (e.clientX < r.left + r.width / 2) min = Math.min(min, +it.dataset.idx); });
      const target = e.clientX - d.x0 > 0 ? to : min;
      if (target !== d.idx) { this.cb.move(d.idx, target); this.showShop(g); }
    };
    own.addEventListener('pointerup', end);
    own.addEventListener('pointercancel', () => { if (drag) { drag.el.style.transform = ''; drag = null; } });
  }

  ownedPopover(g, i) {
    const j = g.jokers[i];
    if (!j) return;
    const d = JOKER_BY_ID[j.id];
    const extra = el('div', 'row');
    extra.appendChild(this.btn('◀ 왼쪽', 'small', () => { if (i > 0) { this.cb.move(i, i - 1); this.hideTip(); this.showShop(g); } }, 'own-left'));
    extra.appendChild(this.btn('오른쪽 ▶', 'small', () => { if (i < g.jokers.length - 1) { this.cb.move(i, i + 1); this.hideTip(); this.showShop(g); } }, 'own-right'));
    this.itemPopover(`${d.name} <span class="rar" style="color:${RARITY_COLOR[d.rarity]}">${RARITY_LABEL[d.rarity]}</span>`, `${i + 1}번째로 발동`, jokerDesc(j, g), `판매 +$${g.sellValue(j)}`, true, () => this.cb.sell(i), extra);
    const sb = this.tip.querySelector('#pop-buy');
    if (sb) { sb.classList.remove('gold'); sb.classList.add('red'); sb.id = 'pop-sell'; }
  }

  showPack(g) {
    const po = g.packOpen;
    const p = PACK_BY_ID[po.pack];
    const box = el('div', 'panel pack');
    box.appendChild(el('h2', '', p.name));
    box.appendChild(el('div', 'hint', '1장을 골라 가질 것'));
    const row = el('div', 'packrow');
    po.choices.forEach((c, k) => {
      const card = el('button', 'pchoice');
      card.style.animationDelay = k * 0.12 + 's';
      let title, desc;
      if (c.kind === 'joker') {
        const d = JOKER_BY_ID[c.id];
        card.appendChild(jokerCanvas({ id: c.id, v: 0, ed: c.ed }, 72, 92));
        title = d.name; desc = d.desc({ v: 0 }, g) + (c.ed ? ` · ${EDITIONS[c.ed].name}: ${EDITIONS[c.ed].desc}` : '');
      } else if (c.kind === 'planet') {
        const pl = PLANET_BY_ID[c.id]; const h = HANDS[pl.hand];
        card.appendChild(itemCanvas('planet', c.id, 72, 92));
        const up = g.hasVoucher('v_telescope') ? 2 : 1;
        title = `${pl.name}`; desc = `${h.name} Lv.${g.lineLv[pl.hand]} → ${g.lineLv[pl.hand] + up}: +${h.lc * up} 칩 +${h.lm * up} 배수`;
      } else {
        const gc = GEM_CARD_BY_ID[c.id];
        card.appendChild(itemCanvas('gem', c.id, 72, 92));
        title = gc.name; desc = gc.desc;
      }
      card.appendChild(el('b', '', title));
      card.appendChild(el('span', '', desc));
      card.dataset.choice = k;
      card.addEventListener('click', () => this.cb.choosePack(k));
      row.appendChild(card);
    });
    box.appendChild(row);
    box.appendChild(this.btn('건너뛰기', 'small', () => this.cb.skipPack(), 'pack-skip'));
    this.showModal(box);
  }

  // ---------- 결과 ----------
  summaryHtml(sum) {
    if (!sum) return '';
    const lv = sum.level;
    return `<div class="earn"><div>${tokenIcon}<b>+${sum.tokens}</b> 토큰</div><div><b>+${sum.xp}</b> XP</div></div>
      <div class="xpbar"><span style="width:${Math.round((lv.cur / lv.need) * 100)}%"></span><em>Lv.${lv.lvl}${sum.levelUp ? ' 레벨 업!' : ''}</em></div>`;
  }

  shareCard(g, won) {
    const rule = DAILY_RULES.find((r) => r.id === g.opts.rule);
    const d = dateKey();
    const text = `블록 조커 데일리 ${d}\n규칙: ${rule ? rule.name : '-'}\n${won ? '승리!' : `앤티 ${g.ante} 도달`} · 최고 한 방 ${fmt(g.runBestHit)} · ${g.totalLines}줄\n조커: ${g.jokers.map((j) => JOKER_BY_ID[j.id].name).join(', ') || '없음'}`;
    const card = el('div', 'share');
    card.innerHTML = `<div class="sh-h">데일리 ${d}</div><div class="sh-b">${won ? '승리!' : `앤티 ${g.ante}`}</div><div class="sh-s">최고 한 방 ${fmt(g.runBestHit)} · ${g.totalLines}줄 · ${rule ? rule.name : ''}</div>`;
    card.appendChild(this.btn('결과 복사', 'small', () => this.cb.shareDaily(text), 'btn-share'));
    return card;
  }

  showOver(g, meta, sum, newBest) {
    const s = this.screens.over;
    const st = meta.d.stats;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', 'over', '게임 오버'));
    const reason = g.gameOverReason === 'stuck' ? '놓을 곳이 없음' : '트레이를 모두 사용함';
    const short = Math.max(0, g.target - g.roundScore);
    box.appendChild(el('div', 'short', `<b>${fmt(short)}점 부족</b> · ${fmt(g.roundScore)} / ${fmt(g.target)}`));
    const tips = g.gameOverReason === 'stuck'
      ? ['보드 가운데를 비워두면 큰 조각도 들어감', '놓을 곳이 없으면 아래 트레이 교체 버튼부터', '3x3, 1x5 조각 자리를 항상 남겨둘 것']
      : ['트레이는 라운드의 수명. 2줄 이상 동시 제거를 노릴 것', '상점의 줄 강화 카드로 자주 지우는 줄 종류를 키울 것', '더하기 조커를 왼쪽, 곱하기 조커를 오른쪽에'];
    box.appendChild(el('div', 'reason', `${reason} · 팁: ${tips[(g.placedCount || 0) % tips.length]}`));
    box.appendChild(el('div', '', this.summaryHtml(sum)));
    if (g.opts.daily) box.appendChild(this.shareCard(g, false));
    const t = el('div', 'stats');
    t.innerHTML = `
      <div><span>도달</span><b>앤티 ${g.ante} · ${g.blindName}</b></div>
      <div><span>이번 런 최고 한 방</span><b>${fmt(g.runBestHit)}</b></div>
      <div><span>지운 줄</span><b>${g.totalLines}</b></div>
      <div><span>최고 앤티</span><b>${st.bestAnte}${newBest && newBest.ante ? ' <em>NEW</em>' : ''}</b></div>
      <div><span>최고 한 방</span><b>${fmt(st.bestHit)}${newBest && newBest.hit ? ' <em>NEW</em>' : ''}</b></div>`;
    box.appendChild(t);
    if (g.jokers.length) {
      const own = el('div', 'owned');
      g.jokers.forEach((j) => own.appendChild(jokerCanvas(j, 44, 56)));
      box.appendChild(own);
    }
    box.appendChild(this.btn(g.opts.daily ? '새 게임 (일반 런)' : '다시하기', 'big gold', () => this.cb.restart(), 'btn-retry'));
    box.appendChild(this.btn('타이틀로', '', () => this.cb.toTitle(), 'btn-over-title'));
    s.appendChild(box);
    this.show('over');
  }

  showVictory(g, meta, sum) {
    const s = this.screens.victory;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', 'win', '승리!'));
    box.appendChild(el('div', 'reason', `앤티 ${CONFIG.FINAL_ANTE} 쇼다운 격파${sum && sum.stakeUnlocked ? ` · ${sum.stakeUnlocked.name} 스테이크 해금!` : ''}`));
    box.appendChild(el('div', '', this.summaryHtml(sum)));
    if (g.opts.daily) box.appendChild(this.shareCard(g, true));
    const st = el('div', 'stats');
    st.innerHTML = `<div><span>최고 한 방</span><b>${fmt(g.runBestHit)}</b></div><div><span>지운 줄</span><b>${g.totalLines}</b></div><div><span>총 승리</span><b>${meta.d.stats.wins}</b></div>`;
    box.appendChild(st);
    box.appendChild(this.btn('엔드리스 계속', 'big gold', () => this.cb.endless(), 'btn-endless'));
    box.appendChild(this.btn('타이틀로', '', () => this.cb.toTitle()));
    s.appendChild(box);
    this.show('victory');
  }

  // ---------- 툴팁 ----------
  showTipHtml(html, extra) {
    this.tip.innerHTML = '';
    const b = el('div', 'tip-box', html);
    if (extra) b.appendChild(extra);
    b.appendChild(this.btn('닫기', 'small', () => this.hideTip(), 'tip-close'));
    this.tip.appendChild(b);
    this.tip.classList.remove('hidden');
  }
  showJokerTip(j, g, idx) {
    const d = JOKER_BY_ID[j.id];
    const extra = el('div', 'row');
    if (idx != null) extra.appendChild(this.btn(`판매 +$${g.sellValue(j)}`, 'small red', () => this.cb.sellInRun(idx), 'tip-sell'));
    this.showTipHtml(`<h3>${d.name} <span class="rar" style="color:${RARITY_COLOR[d.rarity]}">${RARITY_LABEL[d.rarity]}</span></h3><div class="sub2">${idx + 1}번째로 발동</div><p>${jokerDesc(j, g)}</p>${j.disabled ? '<p class="curse">보스 저주로 비활성화됨</p>' : ''}`, extra);
  }
  showBossTip(g) {
    const deck = DECK_BY_ID[g.opts.deck];
    const stake = STAKES[g.opts.stake - 1];
    const rule = g.opts.daily ? DAILY_RULES.find((r) => r.id === g.opts.rule) : null;
    const lv = HAND_KEYS.map((k) => `${HANDS[k].name} ${g.lineLv[k]}`).join(' · ');
    const runInfo = `<p class="dim">${g.opts.daily ? `데일리 런 · ${rule ? rule.name : ''}` : `${stake.name} 스테이크 · ${deck.name}`}</p><p class="dim">줄 레벨: ${lv}</p>`;
    if (g.blind === 2) {
      const b = BOSS_BY_ID[g.boss];
      const ic = el('div', 'row'); ic.appendChild(bossCanvas(g.boss, 64));
      this.showTipHtml(`<h3 style="color:${b.color}">보스: ${b.name}</h3><p>${b.desc}</p><p>목표 ${fmt(g.target)}</p>${runInfo}`, ic);
    } else {
      const b = BOSS_BY_ID[g.boss];
      this.showTipHtml(`<h3>${g.blindName}</h3><p>목표 ${fmt(g.target)}</p><p>이번 앤티 보스: <b style="color:${b.color}">${b.name}</b> (${b.desc})</p>${runInfo}`);
    }
  }
  hideTip() { this.tip.classList.add('hidden'); this.tip.innerHTML = ''; }
  get tipOpen() { return !this.tip.classList.contains('hidden'); }
}

void COLORS; void GEM_COLOR;

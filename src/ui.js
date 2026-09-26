// DOM 오버레이 (타이틀, 설정, 상점, 결과, 컬렉션, 미션, 프로필, 툴팁, 토스트)
import { CONFIG } from './config.js';
import { JOKERS, JOKER_BY_ID, RARITY_LABEL, RARITY_COLOR, jokerDesc, fmt } from './jokers.js';
import { BOSS_BY_ID } from './bosses.js';
import { Renderer, FONT } from './render.js';
import { DECKS, DECK_BY_ID, STAKES, SKINS, ACHIEVEMENTS, MISSION_BY_ID } from './metadata.js';
import { levelInfo } from './meta.js';

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
  return { c, r, padd };
}

export function jokerCanvas(j, w, h, opts = {}) {
  const { c, r, padd } = cardCanvas(w, h);
  r.drawJokerCard(j, padd, padd, w, h, opts);
  return c;
}

// 도감 실루엣 (잠김 / 미발견)
function silhouetteCanvas(w, h, locked) {
  const { c, r, padd } = cardCanvas(w, h);
  const g = r.ctx;
  g.translate(padd, padd);
  g.beginPath(); g.roundRect ? g.roundRect(0, 0, w, h, 8) : g.rect(0, 0, w, h);
  g.fillStyle = locked ? '#120a1e' : '#1d1233'; g.fill();
  g.strokeStyle = locked ? '#3a2d4f' : '#5b4a80'; g.lineWidth = 2; g.stroke();
  g.fillStyle = locked ? '#3a2d4f' : '#6f5c99';
  g.font = `900 ${Math.round(h * 0.38)}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  if (locked) {
    // 자물쇠
    const cx = w / 2, cy = h * 0.45, s = Math.min(w, h) * 0.18;
    g.fillRect(cx - s, cy - s * 0.2, s * 2, s * 1.5);
    g.strokeStyle = '#3a2d4f'; g.lineWidth = s * 0.35;
    g.beginPath(); g.arc(cx, cy - s * 0.2, s * 0.65, Math.PI, 0); g.stroke();
  } else g.fillText('?', w / 2, h * 0.45);
  return c;
}

const tokenIcon = '<i class="tok"></i>';

export class UI {
  constructor(cb) {
    this.cb = cb;
    this.root = $('#ui');
    this.screens = {};
    for (const id of ['title', 'setup', 'pause', 'shop', 'over', 'victory', 'collection', 'missions', 'profile']) {
      const s = el('div', 'screen hidden');
      s.id = 'scr-' + id;
      this.root.appendChild(s);
      this.screens[id] = s;
    }
    this.tip = el('div', 'tip hidden');
    this.root.appendChild(this.tip);
    this.tip.addEventListener('pointerdown', (e) => { if (e.target === this.tip) this.hideTip(); });
    this.toastBox = el('div', 'toasts');
    this.root.appendChild(this.toastBox);
    this.selJoker = -1;
    this.colTab = 'jokers';
    this.colSel = null;
  }

  hideAll() { for (const k in this.screens) this.screens[k].classList.add('hidden'); this.hideTip(); this.current = null; }
  show(id) { this.hideAll(); this.screens[id].classList.remove('hidden'); this.current = id; }
  hide(id) { this.screens[id].classList.add('hidden'); if (this.current === id) this.current = null; }

  btn(label, cls, fn, id) {
    const b = el('button', 'btn ' + (cls || ''), label);
    if (id) b.id = id;
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    return b;
  }

  muteBtn(muted) {
    return this.btn(muted ? '소리 끔' : '소리 켬', 'small mute', () => this.cb.toggleMute(), 'btn-mute');
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

  // ---------- 타이틀 ----------
  showTitle(meta, muted, seed) {
    const s = this.screens.title;
    const d = meta.d;
    s.innerHTML = '';
    const box = el('div', 'title-box');
    // 프로필 뱃지 줄
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
    ['chain', 'sweep', 'jeweler'].forEach((id, i) => {
      const c = jokerCanvas({ id, v: 0 }, 50, 62);
      c.style.transform = `rotate(${(i - 1) * 10}deg) translateY(${i === 1 ? -6 : 0}px)`;
      cards.appendChild(c);
    });
    box.appendChild(cards);

    if (d.run) {
      const r = d.run;
      const nm = r.kind === 'shop' ? '상점' : r.blind === 2 ? '보스 ' + (BOSS_BY_ID[r.boss] ? BOSS_BY_ID[r.boss].name : '') : CONFIG.BLIND_NAMES[r.blind];
      const b = this.btn(`이어하기 <small>${r.opts && r.opts.daily ? '데일리 · ' : ''}앤티 ${r.ante} · ${nm}</small>`, 'big gold two', () => this.cb.continueRun(), 'btn-continue');
      box.appendChild(b);
    }
    box.appendChild(this.btn('새 게임', 'big' + (d.run ? '' : ' gold'), () => this.cb.setup(), 'btn-start'));
    const dl = d.daily;
    const dailyLabel = dl.played ? `데일리 런 <small>오늘 완료 · 최고 앤티 ${dl.bestAnte || '-'}</small>` : '데일리 런 <small>오늘의 시드 · 1회 도전</small>';
    box.appendChild(this.btn(dailyLabel, 'daily two' + (dl.played ? ' off' : ''), () => this.cb.daily(), 'btn-daily'));
    const grid = el('div', 'menu-grid');
    const mdone = meta.missionsDone;
    grid.appendChild(this.btn(`미션 <span class="pill${mdone < 3 ? ' hot' : ''}">${mdone}/3</span>`, 'small', () => this.showMissions(meta), 'btn-missions'));
    const affordable = JOKERS.some((j) => !meta.isJokerUnlocked(j.id) && meta.jokerCost(j.id) <= d.tokens);
    grid.appendChild(this.btn(`컬렉션${affordable ? ' <span class="pill hot">NEW</span>' : ''}`, 'small', () => this.showCollection(meta), 'btn-collection'));
    grid.appendChild(this.btn('프로필', 'small', () => this.showProfile(meta), 'btn-profile'));
    grid.appendChild(this.muteBtn(muted));
    box.appendChild(grid);
    const foot = el('div', 'row');
    foot.appendChild(this.btn('도움말', 'small ghost', () => this.showHelp()));
    box.appendChild(foot);
    if (seed) box.appendChild(el('div', 'seed', `시드: ${seed}`));
    s.appendChild(box);
    this.show('title');
  }

  // ---------- 새 게임 설정 (난이도 + 덱) ----------
  showSetup(meta) {
    const s = this.screens.setup;
    const d = meta.d;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', '', '새 게임'));
    // 스테이크
    const st = STAKES[d.sel.stake - 1];
    const rec = d.stakeRecords[String(st.lv)] || { bestAnte: 0, bestHit: 0, won: false };
    box.appendChild(el('div', 'label', '난이도 (스테이크)'));
    const sp = el('div', 'picker');
    sp.appendChild(this.btn('◀', 'small', () => { if (d.sel.stake > 1) { d.sel.stake--; meta.save(); this.showSetup(meta); } }, 'btn-stake-prev'));
    sp.appendChild(el('div', 'pick', `<b style="color:${st.color}">${st.name}</b><span>${st.lv}단계 · ${st.desc}</span><span class="rec">최고 앤티 ${rec.bestAnte || '-'} · 최고 한 방 ${rec.bestHit ? fmt(rec.bestHit) : '-'}${rec.won ? ' · 승리' : ''}</span>`));
    sp.appendChild(this.btn('▶', 'small', () => { if (d.sel.stake < d.stakeUnlocked) { d.sel.stake++; meta.save(); this.showSetup(meta); } }, 'btn-stake-next'));
    box.appendChild(sp);
    if (d.stakeUnlocked < STAKES.length) box.appendChild(el('div', 'hint', `승리하면 ${STAKES[d.stakeUnlocked].name} 스테이크 해금`));
    // 덱
    box.appendChild(el('div', 'label', '시작 덱'));
    const decks = el('div', 'deck-list');
    for (const dk of DECKS) {
      const own = d.unlocked.decks.includes(dk.id);
      const it = el('button', 'deck' + (d.sel.deck === dk.id ? ' sel' : '') + (own ? '' : ' locked'));
      it.innerHTML = `<i style="background:${dk.color}"></i><b>${dk.name}</b><span>${own ? dk.desc : '잠김 · 컬렉션에서 ' + dk.cost + ' 토큰'}</span>`;
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
      const grid = el('div', 'dex');
      for (const j of JOKERS) {
        const unlocked = meta.isJokerUnlocked(j.id);
        const seen = d.discovered.includes(j.id);
        const c = unlocked && seen ? jokerCanvas({ id: j.id, v: 0 }, 50, 62) : silhouetteCanvas(50, 62, !unlocked);
        const cell = el('div', 'dex-cell' + (this.colSel === j.id ? ' sel' : ''));
        cell.dataset.joker = j.id;
        cell.appendChild(c);
        cell.appendChild(el('div', 'dex-nm', unlocked ? (seen ? j.name : '미발견') : `${tokenIcon}${meta.jokerCost(j.id)}`));
        cell.addEventListener('click', () => { this.colSel = j.id; this.showCollection(meta); });
        grid.appendChild(cell);
      }
      box.appendChild(grid);
      if (this.colSel) {
        const j = JOKER_BY_ID[this.colSel];
        const unlocked = meta.isJokerUnlocked(j.id);
        const seen = d.discovered.includes(j.id);
        const det = el('div', 'detail');
        det.innerHTML = `<div class="nm">${j.name} <span class="rar" style="color:${RARITY_COLOR[j.rarity]}">${RARITY_LABEL[j.rarity]}</span></div><div class="ds">${j.desc({ v: 0 }, null)}</div>` +
          (unlocked ? `<div class="hint">${seen ? '발견함' : '해금됨 · 상점에서 만나면 발견'}</div>` : '');
        if (!unlocked) {
          const cost = meta.jokerCost(j.id);
          det.appendChild(this.btn(`해금 ${cost} 토큰`, 'gold' + (d.tokens >= cost ? '' : ' off'), () => this.cb.unlock('joker', j.id), 'btn-unlock'));
        }
        box.appendChild(det);
      }
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

  // ---------- 미션 ----------
  showMissions(meta) {
    const s = this.screens.missions;
    const d = meta.d;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', '', '오늘의 미션'));
    const now = new Date();
    const mid = new Date(now); mid.setHours(24, 0, 0, 0);
    const left = Math.max(0, mid - now);
    box.appendChild(el('div', 'hint', `${d.daily.date} · 자정까지 ${Math.floor(left / 3600000)}시간 ${Math.floor((left % 3600000) / 60000)}분`));
    const list = el('div', 'missions');
    for (const m of d.daily.missions) {
      const def = MISSION_BY_ID[m.id];
      const it = el('div', 'mission' + (m.done ? ' done' : ''));
      it.innerHTML = `<div class="mt"><b>${def.text(m.n)}</b><span>${tokenIcon}${def.reward}</span></div><div class="bar"><span style="width:${Math.round((Math.min(m.p, m.n) / m.n) * 100)}%"></span></div><div class="mp">${m.done ? '완료!' : `${fmt(Math.min(m.p, m.n))} / ${fmt(m.n)}`}</div>`;
      list.appendChild(it);
    }
    box.appendChild(list);
    const st = el('div', 'stats');
    st.innerHTML = `<div><span>연속 출석</span><b>${d.streak.count}일</b></div><div><span>내일 출석 보상</span><b>${3 + Math.min(d.streak.count + 1, 7) * 2} 토큰</b></div><div><span>데일리 런</span><b>${d.daily.played ? `완료 · 최고 앤티 ${d.daily.bestAnte || '-'}` : '도전 가능'}</b></div>`;
    box.appendChild(st);
    box.appendChild(this.backBtn());
    s.appendChild(box);
    this.show('missions');
  }

  // ---------- 프로필 ----------
  showProfile(meta) {
    const s = this.screens.profile;
    const d = meta.d;
    const st = d.stats;
    s.innerHTML = '';
    const box = el('div', 'panel wide');
    const lv = levelInfo(d.xp);
    box.appendChild(el('h2', '', `프로필 <small>Lv.${lv.lvl}</small>`));
    box.appendChild(el('div', 'xpbar', `<span style="width:${Math.round((lv.cur / lv.need) * 100)}%"></span><em>${lv.cur} / ${lv.need} XP</em>`));
    const t = el('div', 'stats two');
    const rows = [
      ['총 플레이', st.runs], ['승리', st.wins], ['최고 앤티', st.bestAnte || '-'], ['최고 한 방', fmt(st.bestHit)],
      ['최고 라운드 점수', fmt(st.bestRoundScore)], ['제거한 줄', fmt(st.totalLines)], ['클리어 라운드', st.roundsCleared], ['보스 격파', st.bossesBeaten],
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
    const got = ACHIEVEMENTS.filter((a) => d.achievements[a.id]).length;
    box.appendChild(el('div', 'label', `업적 ${got}/${ACHIEVEMENTS.length}`));
    const al = el('div', 'achs');
    for (const a of ACHIEVEMENTS) {
      const ok = !!d.achievements[a.id];
      al.appendChild(el('div', 'ach' + (ok ? ' ok' : ''), `<b>${a.name}</b><span>${a.desc}</span><em>${ok ? '달성' : tokenIcon + a.reward}</em>`));
    }
    box.appendChild(al);
    box.appendChild(this.backBtn());
    s.appendChild(box);
    this.show('profile');
  }

  showHelp() {
    this.showTipHtml(`<h3>게임 방법</h3>
      <p>조각을 끌어서 8x8 보드에 놓고, 가로/세로 줄을 꽉 채우면 제거됨.</p>
      <p><b class="c">칩</b> X <b class="m">배수</b> = 점수. 여러 줄 동시 제거와 연속 제거(콤보)로 배수 상승.</p>
      <p>라운드마다 트레이 ${CONFIG.HANDS}번 안에 목표 점수 달성. 앤티 ${CONFIG.FINAL_ANTE} 보스까지 버티면 승리.</p>
      <p>보석: <span style="color:#ffd23f">금</span> +칩, <span style="color:#ff2e63">루비</span> +배수, <span style="color:#9ff0ff">유리</span> x1.5, <span style="color:#b8c2d6">강철</span> 보드에 있는 동안 줄 제거마다 x1.2</p>
      <p>런이 끝나면 토큰을 받음. 토큰으로 새 조커, 덱, 스킨을 해금할 것.</p>`);
  }

  // ---------- 일시정지 ----------
  showPause(muted) {
    const s = this.screens.pause;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', '', '일시정지'));
    box.appendChild(this.btn('계속하기', 'big gold', () => this.cb.resume(), 'btn-resume'));
    box.appendChild(this.btn('포기하고 새 게임', '', () => this.cb.abandon()));
    box.appendChild(this.btn('타이틀로 (이어하기 저장)', '', () => this.cb.toTitle(), 'btn-pause-title'));
    box.appendChild(this.muteBtn(muted));
    s.appendChild(box);
    this.show('pause');
  }

  // ---------- 상점 ----------
  showShop(g) {
    const s = this.screens.shop;
    s.innerHTML = '';
    const box = el('div', 'panel shop');
    const rw = g.rewards;
    if (rw) {
      box.appendChild(el('h2', 'clear', '라운드 클리어!'));
      const parts = [`블라인드 $${rw.base}`];
      if (rw.hands) parts.push(`남은 트레이 ${rw.handsLeft} x $${CONFIG.COIN_PER_HAND}`);
      if (rw.interest) parts.push(`이자 $${rw.interest}`);
      if (rw.jokerCoins) parts.push(`조커 $${rw.jokerCoins}`);
      box.appendChild(el('div', 'reward', parts.join(' · ') + ` <b>+$${rw.total}</b>`));
    } else box.appendChild(el('h2', 'clear', '상점'));
    const head = el('div', 'shop-head');
    head.appendChild(el('div', 'coins', `<i></i>$${g.coins}`));
    head.appendChild(el('div', 'label', '조커 상점'));
    box.appendChild(head);

    const list = el('div', 'offers');
    g.shop.forEach((o, i) => {
      const d = JOKER_BY_ID[o.id];
      const row = el('div', 'offer' + (o.sold ? ' sold' : ''));
      row.dataset.joker = o.id;
      row.appendChild(jokerCanvas({ id: o.id, v: 0 }, 50, 64));
      const info = el('div', 'info');
      info.innerHTML = `<div class="nm">${d.name} <span class="rar" style="color:${RARITY_COLOR[d.rarity]}">${RARITY_LABEL[d.rarity]}</span>${o.isNew ? ' <span class="pill hot">NEW</span>' : ''}</div><div class="ds">${d.desc({ v: 0 }, null)}</div>`;
      row.appendChild(info);
      const full = g.jokers.length >= g.jokerSlots;
      const can = !o.sold && g.coins >= o.price && !full;
      const b = this.btn(o.sold ? '구매함' : full ? '슬롯 가득' : `$${o.price}`, 'buy' + (can ? ' gold' : ' off'), () => { if (can) this.cb.buy(i); else this.cb.denied(); });
      b.dataset.offer = i;
      row.appendChild(b);
      list.appendChild(row);
    });
    box.appendChild(list);
    const rr = el('div', 'row');
    rr.appendChild(this.btn(`리롤 $${g.rerollCost}`, 'small' + (g.coins >= g.rerollCost ? '' : ' off'), () => this.cb.reroll(), 'btn-reroll'));
    box.appendChild(rr);

    box.appendChild(el('div', 'label', `내 조커 ${g.jokers.length}/${g.jokerSlots} <small>(탭: 판매/순서 변경, 왼쪽부터 발동)</small>`));
    const own = el('div', 'owned');
    for (let i = 0; i < g.jokerSlots; i++) {
      const j = g.jokers[i];
      if (!j) { own.appendChild(el('div', 'slot-empty')); continue; }
      const c = jokerCanvas(j, 52, 64);
      if (i === this.selJoker) c.classList.add('sel');
      c.addEventListener('click', () => { this.selJoker = this.selJoker === i ? -1 : i; this.showShop(g); });
      own.appendChild(c);
    }
    box.appendChild(own);
    if (this.selJoker >= 0 && g.jokers[this.selJoker]) {
      const j = g.jokers[this.selJoker];
      const d = JOKER_BY_ID[j.id];
      const det = el('div', 'detail');
      det.innerHTML = `<div class="nm">${d.name}</div><div class="ds">${jokerDesc(j, g)}</div>`;
      const r2 = el('div', 'row');
      const si = this.selJoker;
      r2.appendChild(this.btn('◀', 'small', () => { if (si > 0) { this.cb.move(si, si - 1); this.selJoker = si - 1; this.showShop(g); } }));
      r2.appendChild(this.btn(`판매 $${g.sellValue(j)}`, 'small red', () => { this.selJoker = -1; this.cb.sell(si); }));
      r2.appendChild(this.btn('▶', 'small', () => { if (si < g.jokers.length - 1) { this.cb.move(si, si + 1); this.selJoker = si + 1; this.showShop(g); } }));
      det.appendChild(r2);
      box.appendChild(det);
    }

    const boss = g.blind === 2;
    const nm = boss ? BOSS_BY_ID[g.boss].name : CONFIG.BLIND_NAMES[g.blind];
    const next = el('div', 'next' + (boss ? ' boss' : ''));
    next.innerHTML = `<div>다음: 앤티 ${g.ante} · <b>${nm}</b> · 목표 ${fmt(g.targetOf(g.ante, g.blind))}</div>` + (boss ? `<div class="curse">저주: ${BOSS_BY_ID[g.boss].desc}</div>` : '');
    box.appendChild(next);
    box.appendChild(this.btn('다음 라운드', 'big gold', () => { this.selJoker = -1; this.cb.next(); }, 'btn-next'));
    s.appendChild(box);
    this.show('shop');
  }

  // ---------- 결과 ----------
  summaryHtml(sum) {
    if (!sum) return '';
    const lv = sum.level;
    return `<div class="earn"><div>${tokenIcon}<b>+${sum.tokens}</b> 토큰</div><div><b>+${sum.xp}</b> XP</div></div>
      <div class="xpbar"><span style="width:${Math.round((lv.cur / lv.need) * 100)}%"></span><em>Lv.${lv.lvl}${sum.levelUp ? ' 레벨 업!' : ''}</em></div>`;
  }

  showOver(g, meta, sum, newBest) {
    const s = this.screens.over;
    const st = meta.d.stats;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', 'over', '게임 오버'));
    const reason = g.gameOverReason === 'stuck' ? '놓을 곳이 없음' : g.gameOverReason === 'abandon' ? '런 포기' : '트레이를 모두 사용함';
    box.appendChild(el('div', 'reason', `${reason} · ${fmt(g.roundScore)} / ${fmt(g.target)}`));
    box.appendChild(el('div', '', this.summaryHtml(sum)));
    const t = el('div', 'stats');
    t.innerHTML = `
      <div><span>도달</span><b>앤티 ${g.ante} · ${g.blindName}</b></div>
      <div><span>이번 런 최고 한 방</span><b>${fmt(g.runBestHit)}</b></div>
      <div><span>지운 줄</span><b>${g.totalLines}</b></div>
      <div><span>최고 앤티</span><b>${st.bestAnte}${newBest.ante ? ' <em>NEW</em>' : ''}</b></div>
      <div><span>최고 한 방</span><b>${fmt(st.bestHit)}${newBest.hit ? ' <em>NEW</em>' : ''}</b></div>`;
    box.appendChild(t);
    if (g.jokers.length) {
      const own = el('div', 'owned');
      g.jokers.forEach((j) => own.appendChild(jokerCanvas(j, 44, 54)));
      box.appendChild(own);
    }
    box.appendChild(this.btn('다시하기', 'big gold', () => this.cb.restart(), 'btn-retry'));
    box.appendChild(this.btn('타이틀로', '', () => this.cb.toTitle(), 'btn-over-title'));
    s.appendChild(box);
    this.show('over');
  }

  showVictory(g, meta, sum) {
    const s = this.screens.victory;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', 'win', '승리!'));
    box.appendChild(el('div', 'reason', `앤티 ${CONFIG.FINAL_ANTE} 보스 격파${sum && sum.stakeUnlocked ? ` · ${sum.stakeUnlocked.name} 스테이크 해금!` : ''}`));
    box.appendChild(el('div', '', this.summaryHtml(sum)));
    const st = el('div', 'stats');
    st.innerHTML = `<div><span>최고 한 방</span><b>${fmt(g.runBestHit)}</b></div><div><span>지운 줄</span><b>${g.totalLines}</b></div><div><span>총 승리</span><b>${meta.d.stats.wins}</b></div>`;
    box.appendChild(st);
    box.appendChild(this.btn('엔드리스 계속', 'big gold', () => this.cb.endless(), 'btn-endless'));
    box.appendChild(this.btn('타이틀로', '', () => this.cb.toTitle()));
    s.appendChild(box);
    this.show('victory');
  }

  // ---------- 툴팁 ----------
  showTipHtml(html) {
    this.tip.innerHTML = '';
    const b = el('div', 'tip-box', html);
    b.appendChild(this.btn('닫기', 'small', () => this.hideTip()));
    this.tip.appendChild(b);
    this.tip.classList.remove('hidden');
  }
  showJokerTip(j, g) {
    const d = JOKER_BY_ID[j.id];
    this.showTipHtml(`<h3>${d.name} <span class="rar" style="color:${RARITY_COLOR[d.rarity]}">${RARITY_LABEL[d.rarity]}</span></h3><p>${jokerDesc(j, g)}</p>${j.disabled ? '<p class="curse">보스 저주로 비활성화됨</p>' : ''}`);
  }
  showBossTip(g) {
    const deck = DECK_BY_ID[g.opts.deck];
    const stake = STAKES[g.opts.stake - 1];
    const runInfo = `<p class="dim">${g.opts.daily ? '데일리 런' : `${stake.name} 스테이크`} · ${deck.name}</p>`;
    if (g.blind === 2) {
      const b = BOSS_BY_ID[g.boss];
      this.showTipHtml(`<h3 style="color:${b.color}">보스: ${b.name}</h3><p>${b.desc}</p><p>목표 ${fmt(g.target)}</p>${runInfo}`);
    } else {
      this.showTipHtml(`<h3>${g.blindName}</h3><p>목표 ${fmt(g.target)}</p><p>이번 앤티 보스: <b style="color:${BOSS_BY_ID[g.boss].color}">${BOSS_BY_ID[g.boss].name}</b> (${BOSS_BY_ID[g.boss].desc})</p>${runInfo}`);
    }
  }
  hideTip() { this.tip.classList.add('hidden'); }
  get tipOpen() { return !this.tip.classList.contains('hidden'); }
}

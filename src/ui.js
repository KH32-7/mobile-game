// DOM 오버레이 (타이틀, 일시정지, 상점, 결과, 툴팁)
import { CONFIG, targetFor } from './config.js';
import { JOKER_BY_ID, RARITY_LABEL, RARITY_COLOR, jokerDesc, fmt } from './jokers.js';
import { BOSS_BY_ID } from './bosses.js';
import { Renderer } from './render.js';

const $ = (sel) => document.querySelector(sel);

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

export function jokerCanvas(j, w, h, opts = {}) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const padd = 4;
  const c = document.createElement('canvas');
  c.width = Math.round((w + padd * 2) * dpr); c.height = Math.round((h + padd * 2) * dpr);
  c.style.width = w + padd * 2 + 'px'; c.style.height = h + padd * 2 + 'px';
  c.className = 'jcard';
  const r = new Renderer(c);
  r.dpr = dpr;
  r.ctx.scale(dpr, dpr);
  r.drawJokerCard(j, padd, padd, w, h, opts);
  return c;
}

export class UI {
  constructor(cb) {
    this.cb = cb; // { start, resume, restart, toTitle, toggleMute, buy, sell, reroll, next, endless, move }
    this.root = $('#ui');
    this.screens = {};
    for (const id of ['title', 'pause', 'shop', 'over', 'victory']) {
      const s = el('div', 'screen hidden');
      s.id = 'scr-' + id;
      this.root.appendChild(s);
      this.screens[id] = s;
    }
    this.tip = el('div', 'tip hidden');
    this.root.appendChild(this.tip);
    this.tip.addEventListener('pointerdown', (e) => { if (e.target === this.tip) this.hideTip(); });
    this.selJoker = -1;
  }

  hideAll() { for (const k in this.screens) this.screens[k].classList.add("hidden"); this.hideTip(); this.current = null; }
  show(id) { this.hideAll(); this.screens[id].classList.remove('hidden'); this.current = id; }
  hide(id) { this.screens[id].classList.add('hidden'); if (this.current === id) this.current = null; }

  btn(label, cls, fn, id) {
    const b = el('button', 'btn ' + (cls || ''), label);
    if (id) b.id = id;
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    return b;
  }

  muteBtn(muted) {
    return this.btn(muted ? '소리 끔' : '소리 켬', 'small mute', () => this.cb.toggleMute());
  }

  // ---------- 타이틀 ----------
  showTitle(rec, muted, seed) {
    const s = this.screens.title;
    s.innerHTML = '';
    const box = el('div', 'title-box');
    box.appendChild(el('div', 'logo', '<span class="l1">블록</span><span class="l2">조커</span>'));
    box.appendChild(el('div', 'sub', 'BLOCK JOKER · 블록 퍼즐 로그라이크'));
    const cards = el('div', 'title-cards');
    ['chain', 'sweep', 'jeweler'].forEach((id, i) => {
      const c = jokerCanvas({ id, v: 0 }, 58, 72);
      c.style.transform = `rotate(${(i - 1) * 10}deg) translateY(${i === 1 ? -6 : 0}px)`;
      cards.appendChild(c);
    });
    box.appendChild(cards);
    const recs = el('div', 'records');
    recs.innerHTML = `<div><b>${rec.bestAnte || '-'}</b><span>최고 앤티</span></div><div><b>${rec.bestHit ? fmt(rec.bestHit) : '-'}</b><span>최고 한 방</span></div><div><b>${rec.wins || 0}</b><span>승리</span></div>`;
    box.appendChild(recs);
    box.appendChild(this.btn('게임 시작', 'big gold', () => this.cb.start(), 'btn-start'));
    const row = el('div', 'row');
    row.appendChild(this.muteBtn(muted));
    row.appendChild(this.btn('도움말', 'small', () => this.showHelp()));
    box.appendChild(row);
    if (seed) box.appendChild(el('div', 'seed', `시드: ${seed}`));
    s.appendChild(box);
    this.show('title');
  }

  showHelp() {
    this.showTipHtml(`<h3>게임 방법</h3>
      <p>조각을 끌어서 8x8 보드에 놓고, 가로/세로 줄을 꽉 채우면 제거됨.</p>
      <p><b class="c">칩</b> X <b class="m">배수</b> = 점수. 여러 줄 동시 제거와 연속 제거(콤보)로 배수 상승.</p>
      <p>라운드마다 트레이 ${CONFIG.HANDS}번 안에 목표 점수 달성. 앤티 ${CONFIG.FINAL_ANTE} 보스까지 버티면 승리.</p>
      <p>보석: <span style="color:#ffd23f">금</span> +칩, <span style="color:#ff2e63">루비</span> +배수, <span style="color:#9ff0ff">유리</span> x1.5, <span style="color:#b8c2d6">강철</span> 보드에 있는 동안 줄 제거마다 x1.2</p>
      <p>상점에서 조커를 사서 빌드를 완성할 것. 조커는 왼쪽부터 순서대로 발동.</p>`);
  }

  // ---------- 일시정지 ----------
  showPause(muted) {
    const s = this.screens.pause;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', '', '일시정지'));
    box.appendChild(this.btn('계속하기', 'big gold', () => this.cb.resume(), 'btn-resume'));
    box.appendChild(this.btn('새 런 시작', '', () => this.cb.restart()));
    box.appendChild(this.btn('타이틀로', '', () => this.cb.toTitle()));
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
    }
    const head = el('div', 'shop-head');
    head.appendChild(el('div', 'coins', `<i></i>$${g.coins}`));
    head.appendChild(el('div', 'label', '조커 상점'));
    box.appendChild(head);

    const list = el('div', 'offers');
    g.shop.forEach((o, i) => {
      const d = JOKER_BY_ID[o.id];
      const row = el('div', 'offer' + (o.sold ? ' sold' : ''));
      row.appendChild(jokerCanvas({ id: o.id, v: 0 }, 50, 64));
      const info = el('div', 'info');
      info.innerHTML = `<div class="nm">${d.name} <span class="rar" style="color:${RARITY_COLOR[d.rarity]}">${RARITY_LABEL[d.rarity]}</span></div><div class="ds">${d.desc({ v: 0 }, null)}</div>`;
      row.appendChild(info);
      const full = g.jokers.length >= CONFIG.JOKER_SLOTS;
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

    // 보유 조커
    box.appendChild(el('div', 'label', `내 조커 ${g.jokers.length}/${CONFIG.JOKER_SLOTS} <small>(탭: 판매/순서 변경)</small>`));
    const own = el('div', 'owned');
    for (let i = 0; i < CONFIG.JOKER_SLOTS; i++) {
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

    // 다음 라운드
    const boss = g.blind === 2;
    const nm = boss ? BOSS_BY_ID[g.boss].name : CONFIG.BLIND_NAMES[g.blind];
    const next = el('div', 'next' + (boss ? ' boss' : ''));
    next.innerHTML = `<div>다음: 앤티 ${g.ante} · <b>${nm}</b> · 목표 ${fmt(targetFor(g.ante, g.blind))}</div>` + (boss ? `<div class="curse">저주: ${BOSS_BY_ID[g.boss].desc}</div>` : '');
    box.appendChild(next);
    box.appendChild(this.btn('다음 라운드', 'big gold', () => { this.selJoker = -1; this.cb.next(); }, 'btn-next'));
    s.appendChild(box);
    this.show('shop');
  }

  // ---------- 결과 ----------
  showOver(g, rec, newBest) {
    const s = this.screens.over;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', 'over', '게임 오버'));
    const reason = g.gameOverReason === 'stuck' ? '놓을 곳이 없음' : '트레이를 모두 사용함';
    box.appendChild(el('div', 'reason', `${reason} · ${fmt(g.roundScore)} / ${fmt(g.target)}`));
    const st = el('div', 'stats');
    st.innerHTML = `
      <div><span>도달</span><b>앤티 ${g.ante} · ${g.blindName}</b></div>
      <div><span>이번 런 최고 한 방</span><b>${fmt(g.runBestHit)}</b></div>
      <div><span>지운 줄</span><b>${g.totalLines}</b></div>
      <div><span>최고 앤티</span><b>${rec.bestAnte}${newBest.ante ? ' <em>NEW</em>' : ''}</b></div>
      <div><span>최고 한 방</span><b>${fmt(rec.bestHit)}${newBest.hit ? ' <em>NEW</em>' : ''}</b></div>`;
    box.appendChild(st);
    if (g.jokers.length) {
      const own = el('div', 'owned');
      g.jokers.forEach((j) => own.appendChild(jokerCanvas(j, 44, 54)));
      box.appendChild(own);
    }
    box.appendChild(this.btn('다시하기', 'big gold', () => this.cb.restart(), 'btn-retry'));
    box.appendChild(this.btn('타이틀로', '', () => this.cb.toTitle()));
    s.appendChild(box);
    this.show('over');
  }

  showVictory(g, rec) {
    const s = this.screens.victory;
    s.innerHTML = '';
    const box = el('div', 'panel');
    box.appendChild(el('h2', 'win', '승리!'));
    box.appendChild(el('div', 'reason', `앤티 ${CONFIG.FINAL_ANTE} 보스 격파`));
    const st = el('div', 'stats');
    st.innerHTML = `<div><span>최고 한 방</span><b>${fmt(g.runBestHit)}</b></div><div><span>지운 줄</span><b>${g.totalLines}</b></div><div><span>총 승리</span><b>${rec.wins}</b></div>`;
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
    if (g.blind === 2) {
      const b = BOSS_BY_ID[g.boss];
      this.showTipHtml(`<h3 style="color:${b.color}">보스: ${b.name}</h3><p>${b.desc}</p><p>목표 ${fmt(g.target)}</p>`);
    } else {
      this.showTipHtml(`<h3>${g.blindName}</h3><p>목표 ${fmt(g.target)} · 클리어 보상 $${CONFIG.BLIND_REWARD[g.blind]}</p><p>이번 앤티 보스: <b style="color:${BOSS_BY_ID[g.boss].color}">${BOSS_BY_ID[g.boss].name}</b> (${BOSS_BY_ID[g.boss].desc})</p>`);
    }
  }
  hideTip() { this.tip.classList.add('hidden'); }
  get tipOpen() { return !this.tip.classList.contains('hidden'); }
}

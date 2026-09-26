// 스와이프(Pointer Events) + 키보드 입력
const SWIPE_MIN = 28;

export function createInput(el, onAction) {
  let sx = 0, sy = 0, st = 0, active = false, fired = false, pid = null;

  el.addEventListener('pointerdown', (e) => {
    active = true; fired = false; pid = e.pointerId;
    sx = e.clientX; sy = e.clientY; st = performance.now();
    try { el.setPointerCapture(e.pointerId); } catch (_) { /* 무시 */ }
  });
  el.addEventListener('pointermove', (e) => {
    if (!active || fired || e.pointerId !== pid) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.hypot(dx, dy) < SWIPE_MIN) return;
    fired = true;
    if (Math.abs(dx) > Math.abs(dy)) onAction(dx > 0 ? 'right' : 'left');
    else onAction(dy > 0 ? 'down' : 'up');
  });
  const end = (e) => {
    if (!active || e.pointerId !== pid) return;
    active = false;
    if (!fired) {
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.hypot(dx, dy) >= SWIPE_MIN * 0.6) {
        if (Math.abs(dx) > Math.abs(dy)) onAction(dx > 0 ? 'right' : 'left');
        else onAction(dy > 0 ? 'down' : 'up');
      } else if (performance.now() - st < 300) onAction('tap');
    }
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', (e) => { if (e.pointerId === pid) active = false; });

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    let a = null;
    if (k === 'arrowleft' || k === 'a') a = 'left';
    else if (k === 'arrowright' || k === 'd') a = 'right';
    else if (k === 'arrowup' || k === 'w' || k === ' ') a = 'up';
    else if (k === 'arrowdown' || k === 's') a = 'down';
    else if (k === 'escape' || k === 'p') a = 'pause';
    if (a) { e.preventDefault(); onAction(a, true); }
  });
}

// 꾸미기 드로잉 (공 스킨, 깃발) - 렌더러와 UI 미리보기에서 공용
export function drawBallSkin(x, bx, by, r, skin, time) {
  let c0, c1;
  if (skin.rainbow) {
    const h = (time * 120) % 360;
    c0 = `hsl(${h},100%,85%)`;
    c1 = `hsl(${(h + 60) % 360},90%,55%)`;
  } else [c0, c1] = skin.colors;
  if (skin.glow) {
    x.fillStyle = skin.glow + '55';
    x.beginPath();
    x.arc(bx, by, r * 1.7, 0, 7);
    x.fill();
  }
  const gr = x.createRadialGradient(bx - r * 0.4, by - r * 0.4, r * 0.1, bx, by, r);
  gr.addColorStop(0, c0);
  gr.addColorStop(0.7, c0);
  gr.addColorStop(1, c1);
  x.fillStyle = gr;
  x.beginPath();
  x.arc(bx, by, r, 0, 7);
  x.fill();
  if (skin.stripe) {
    x.strokeStyle = skin.stripe;
    x.lineWidth = r * 0.22;
    x.save();
    x.beginPath();
    x.arc(bx, by, r, 0, 7);
    x.clip();
    for (const o of [-0.5, 0, 0.5]) {
      x.beginPath();
      x.moveTo(bx + o * r * 1.3, by - r);
      x.quadraticCurveTo(bx + o * r * 1.9, by, bx + o * r * 1.3, by + r);
      x.stroke();
    }
    x.restore();
  }
  if (skin.dot) {
    x.fillStyle = skin.dot;
    x.beginPath();
    x.arc(bx, by, r * 0.45, 0, 7);
    x.fill();
    x.fillStyle = '#111';
    x.font = `900 ${r * 0.6}px system-ui,sans-serif`;
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText('8', bx, by + r * 0.04);
  }
  x.fillStyle = 'rgba(255,255,255,0.7)';
  x.beginPath();
  x.arc(bx - r * 0.35, by - r * 0.35, r * 0.22, 0, 7);
  x.fill();
}

export function drawFlag(x, px, py, pole, flag, themeColor, time) {
  x.strokeStyle = '#eeeeee';
  x.lineWidth = Math.max(2, pole * 0.06);
  x.beginPath();
  x.moveTo(px, py);
  x.lineTo(px, py - pole);
  x.stroke();
  const fy = py - pole;
  const W = pole * 0.55,
    H = pole * 0.34;
  const wave = (u) => Math.sin(time * 6 - u * 3) * H * 0.18 * u;
  x.save();
  x.beginPath();
  x.moveTo(px + 1, fy);
  const n = 6;
  for (let k = 1; k <= n; k++) x.lineTo(px + 1 + (k / n) * W, fy + (k / n) * H * 0.45 + wave(k / n));
  for (let k = n; k >= 0; k--) x.lineTo(px + 1 + (k / n) * W, fy + H - (k / n) * H * 0.55 + wave(k / n));
  x.closePath();
  if (flag.rainbow) {
    const g = x.createLinearGradient(px, fy, px, fy + H);
    ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#7c4dff'].forEach((c, i) => g.addColorStop(i / 4, c));
    x.fillStyle = g;
  } else x.fillStyle = flag.color || themeColor;
  x.fill();
  x.clip();
  if (flag.pattern === 'check') {
    x.fillStyle = '#111';
    const q = H / 4;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) x.fillRect(px + 1 + i * q, fy + j * q + wave(i / 8), q, q);
  }
  if (flag.mark) {
    x.fillStyle = flag.mark;
    x.beginPath();
    x.arc(px + W * 0.45, fy + H * 0.45 + wave(0.45), H * 0.2, 0, 7);
    x.fill();
  }
  x.restore();
}

// 절차적 아이콘 (카드/유닛/유물). 중심 (0,0), 반경 약 1 기준으로 그림
const OUT = '#2a2233';

function stroke(ctx, w = 0.08) {
  ctx.lineWidth = w;
  ctx.strokeStyle = OUT;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
}
function fillS(ctx, color, w) {
  ctx.fillStyle = color;
  ctx.fill();
  stroke(ctx, w);
}
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}
function eyes(ctx, y, gap, r, color = OUT) {
  ctx.fillStyle = color;
  circle(ctx, -gap, y, r);
  ctx.fill();
  circle(ctx, gap, y, r);
  ctx.fill();
}
function star(ctx, x, y, r, n = 5, inner = 0.45) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r * inner : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
}
export { star };

function arrowShape(ctx, x1, y1, x2, y2, col = '#8a5a2a') {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineWidth = 0.1;
  ctx.strokeStyle = col;
  ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2 + Math.cos(a) * 0.22, y2 + Math.sin(a) * 0.22);
  ctx.lineTo(x2 + Math.cos(a + 2.4) * 0.2, y2 + Math.sin(a + 2.4) * 0.2);
  ctx.lineTo(x2 + Math.cos(a - 2.4) * 0.2, y2 + Math.sin(a - 2.4) * 0.2);
  ctx.closePath();
  fillS(ctx, '#e8e8f0', 0.05);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + Math.cos(a + 2.6) * 0.2, y1 + Math.sin(a + 2.6) * 0.2);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + Math.cos(a - 2.6) * 0.2, y1 + Math.sin(a - 2.6) * 0.2);
  ctx.lineWidth = 0.08;
  ctx.strokeStyle = '#f0f0f0';
  ctx.stroke();
}

const DRAW = {
  knight(ctx) {
    // 투구
    ctx.beginPath();
    ctx.moveTo(-0.55, 0.6);
    ctx.lineTo(-0.6, -0.1);
    ctx.quadraticCurveTo(-0.6, -0.7, 0, -0.72);
    ctx.quadraticCurveTo(0.6, -0.7, 0.6, -0.1);
    ctx.lineTo(0.55, 0.6);
    ctx.closePath();
    fillS(ctx, '#c9d2de');
    ctx.fillStyle = OUT;
    ctx.fillRect(-0.42, -0.12, 0.84, 0.14);
    ctx.fillRect(-0.06, -0.12, 0.12, 0.55);
    // 깃털
    ctx.beginPath();
    ctx.moveTo(0, -0.72);
    ctx.quadraticCurveTo(0.2, -1.05, 0.62, -0.95);
    ctx.quadraticCurveTo(0.3, -0.8, 0.1, -0.65);
    fillS(ctx, '#e0503a', 0.06);
  },
  archers(ctx) {
    // 후드 얼굴
    ctx.beginPath();
    ctx.moveTo(-0.55, 0.55);
    ctx.quadraticCurveTo(-0.6, -0.55, 0, -0.75);
    ctx.quadraticCurveTo(0.6, -0.55, 0.55, 0.55);
    ctx.closePath();
    fillS(ctx, '#3f8a4a');
    circle(ctx, 0, 0.05, 0.36);
    fillS(ctx, '#f3c9a0', 0.06);
    eyes(ctx, 0.02, 0.13, 0.055);
    // 활
    ctx.beginPath();
    ctx.arc(0.55, 0.05, 0.6, -1.2, 1.2);
    ctx.lineWidth = 0.12;
    ctx.strokeStyle = '#7a4a1a';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.55 + Math.cos(-1.2) * 0.6, 0.05 + Math.sin(-1.2) * 0.6);
    ctx.lineTo(0.55 + Math.cos(1.2) * 0.6, 0.05 + Math.sin(1.2) * 0.6);
    ctx.lineWidth = 0.03;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  },
  giant(ctx) {
    circle(ctx, 0, -0.05, 0.62);
    fillS(ctx, '#e8b88a');
    // 수염
    ctx.beginPath();
    ctx.moveTo(-0.5, 0.1);
    ctx.quadraticCurveTo(0, 1.0, 0.5, 0.1);
    ctx.quadraticCurveTo(0, 0.35, -0.5, 0.1);
    fillS(ctx, '#c8742a', 0.06);
    ctx.fillStyle = OUT;
    ctx.fillRect(-0.36, -0.28, 0.24, 0.07);
    ctx.fillRect(0.12, -0.28, 0.24, 0.07);
    eyes(ctx, -0.12, 0.22, 0.06);
  },
  goblins(ctx) {
    ctx.beginPath();
    ctx.moveTo(-0.45, -0.2);
    ctx.lineTo(-0.95, -0.45);
    ctx.lineTo(-0.5, 0.1);
    ctx.closePath();
    fillS(ctx, '#7cc050');
    ctx.beginPath();
    ctx.moveTo(0.45, -0.2);
    ctx.lineTo(0.95, -0.45);
    ctx.lineTo(0.5, 0.1);
    ctx.closePath();
    fillS(ctx, '#7cc050');
    circle(ctx, 0, 0, 0.55);
    fillS(ctx, '#8ad05a');
    eyes(ctx, -0.1, 0.2, 0.08, '#fff');
    eyes(ctx, -0.1, 0.2, 0.04);
    ctx.beginPath();
    ctx.arc(0, 0.15, 0.25, 0.2, Math.PI - 0.2);
    stroke(ctx, 0.07);
  },
  skeletons(ctx) {
    circle(ctx, 0, -0.12, 0.55);
    fillS(ctx, '#f4f0e6');
    ctx.beginPath();
    ctx.rect(-0.3, 0.25, 0.6, 0.35);
    fillS(ctx, '#f4f0e6');
    eyes(ctx, -0.12, 0.2, 0.14);
    ctx.fillStyle = OUT;
    for (let i = -1; i <= 1; i++) ctx.fillRect(i * 0.15 - 0.02, 0.3, 0.04, 0.25);
    ctx.beginPath();
    ctx.moveTo(0, 0.02);
    ctx.lineTo(-0.06, 0.14);
    ctx.lineTo(0.06, 0.14);
    ctx.fill();
  },
  wizard(ctx) {
    circle(ctx, 0, 0.3, 0.38);
    fillS(ctx, '#f3c9a0');
    ctx.beginPath();
    ctx.moveTo(-0.3, 0.45);
    ctx.quadraticCurveTo(0, 1.05, 0.3, 0.45);
    fillS(ctx, '#eeeeee', 0.05);
    eyes(ctx, 0.25, 0.13, 0.05);
    ctx.beginPath();
    ctx.moveTo(-0.7, 0.05);
    ctx.lineTo(0.7, 0.05);
    ctx.lineTo(0.12, -0.95);
    ctx.lineTo(-0.1, -0.8);
    ctx.closePath();
    fillS(ctx, '#5a3aa0');
    star(ctx, 0.05, -0.3, 0.16);
    ctx.fillStyle = '#ffe36b';
    ctx.fill();
  },
  minidragon(ctx) {
    // 날개
    for (const sgn of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(sgn * 0.25, -0.1);
      ctx.lineTo(sgn * 0.95, -0.6);
      ctx.lineTo(sgn * 0.8, 0.0);
      ctx.lineTo(sgn * 0.95, 0.2);
      ctx.lineTo(sgn * 0.3, 0.2);
      ctx.closePath();
      fillS(ctx, '#e89a5a');
    }
    circle(ctx, 0, 0.05, 0.45);
    fillS(ctx, '#e0603a');
    ctx.beginPath();
    ctx.moveTo(-0.25, -0.3);
    ctx.lineTo(-0.35, -0.65);
    ctx.lineTo(-0.08, -0.38);
    ctx.moveTo(0.25, -0.3);
    ctx.lineTo(0.35, -0.65);
    ctx.lineTo(0.08, -0.38);
    fillS(ctx, '#f0d080', 0.05);
    eyes(ctx, -0.02, 0.17, 0.08, '#ffe36b');
    eyes(ctx, -0.02, 0.17, 0.035);
    circle(ctx, -0.08, 0.25, 0.03);
    circle(ctx, 0.08, 0.25, 0.03);
    ctx.fill();
  },
  bomber(ctx) {
    circle(ctx, -0.05, 0.12, 0.6);
    fillS(ctx, '#3a3a4a');
    circle(ctx, -0.25, -0.1, 0.14);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0.15, -0.6, 0.22, 0.2);
    fillS(ctx, '#6a6a7a', 0.05);
    ctx.beginPath();
    ctx.moveTo(0.26, -0.6);
    ctx.quadraticCurveTo(0.3, -0.9, 0.55, -0.85);
    ctx.lineWidth = 0.07;
    ctx.strokeStyle = '#c8a060';
    ctx.stroke();
    star(ctx, 0.6, -0.88, 0.2, 6, 0.4);
    ctx.fillStyle = '#ffd040';
    ctx.fill();
  },
  lancer(ctx) {
    // 투구 + 창
    ctx.beginPath();
    ctx.moveTo(-0.9, 0.8);
    ctx.lineTo(0.7, -0.8);
    ctx.lineWidth = 0.14;
    ctx.strokeStyle = '#8a5a2a';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.95, -1.0);
    ctx.lineTo(0.5, -0.8);
    ctx.lineTo(0.72, -0.55);
    ctx.closePath();
    fillS(ctx, '#e8e8f0', 0.05);
    ctx.beginPath();
    ctx.moveTo(0.35, -0.45);
    ctx.lineTo(0.05, -0.55);
    ctx.lineTo(0.2, -0.25);
    ctx.closePath();
    fillS(ctx, '#e0503a', 0.05);
    circle(ctx, -0.15, 0.2, 0.42);
    fillS(ctx, '#b0b8c8');
    ctx.fillStyle = OUT;
    ctx.fillRect(-0.45, 0.12, 0.6, 0.1);
  },
  cannon(ctx) {
    ctx.save();
    ctx.rotate(-0.4);
    ctx.beginPath();
    ctx.rect(-0.3, -0.28, 1.0, 0.5);
    fillS(ctx, '#4a4a5a');
    ctx.beginPath();
    ctx.rect(0.6, -0.33, 0.18, 0.6);
    fillS(ctx, '#5a5a6a');
    ctx.restore();
    ctx.beginPath();
    ctx.rect(-0.7, 0.2, 1.1, 0.3);
    fillS(ctx, '#8a5a2a');
    circle(ctx, -0.35, 0.55, 0.28);
    fillS(ctx, '#a06a30');
    circle(ctx, 0.2, 0.55, 0.28);
    fillS(ctx, '#a06a30');
  },
  totem(ctx) {
    ctx.beginPath();
    ctx.rect(-0.35, -0.8, 0.7, 1.6);
    fillS(ctx, '#b8844a');
    ctx.fillStyle = OUT;
    ctx.fillRect(-0.35, -0.2, 0.7, 0.06);
    eyes(ctx, -0.5, 0.14, 0.07);
    eyes(ctx, 0.15, 0.14, 0.07);
    ctx.beginPath();
    ctx.rect(-0.15, 0.4, 0.3, 0.08);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0.35, -0.6);
    ctx.lineTo(0.9, -0.8);
    ctx.lineTo(0.35, -0.3);
    ctx.moveTo(-0.35, -0.6);
    ctx.lineTo(-0.9, -0.8);
    ctx.lineTo(-0.35, -0.3);
    fillS(ctx, '#5fb59a', 0.05);
    // 치유 십자
    ctx.fillStyle = '#7dff9a';
    ctx.fillRect(-0.08, -1.05, 0.16, 0.36);
    ctx.fillRect(-0.18, -0.95, 0.36, 0.16);
  },
  fireball(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, -0.95);
    ctx.bezierCurveTo(0.35, -0.5, 0.75, -0.25, 0.65, 0.25);
    ctx.bezierCurveTo(0.55, 0.8, -0.55, 0.8, -0.65, 0.25);
    ctx.bezierCurveTo(-0.72, -0.1, -0.4, -0.3, -0.3, -0.65);
    ctx.bezierCurveTo(-0.1, -0.4, 0, -0.6, 0, -0.95);
    fillS(ctx, '#ff7a2a');
    ctx.beginPath();
    ctx.moveTo(0, -0.3);
    ctx.bezierCurveTo(0.3, 0, 0.4, 0.2, 0.3, 0.4);
    ctx.bezierCurveTo(0.2, 0.62, -0.25, 0.62, -0.32, 0.4);
    ctx.bezierCurveTo(-0.38, 0.15, -0.1, 0, 0, -0.3);
    ctx.fillStyle = '#ffe36b';
    ctx.fill();
  },
  lightning(ctx) {
    ctx.beginPath();
    ctx.moveTo(0.15, -0.95);
    ctx.lineTo(-0.45, 0.1);
    ctx.lineTo(-0.02, 0.1);
    ctx.lineTo(-0.2, 0.95);
    ctx.lineTo(0.5, -0.2);
    ctx.lineTo(0.08, -0.2);
    ctx.lineTo(0.35, -0.95);
    ctx.closePath();
    fillS(ctx, '#ffe040');
  },
  freeze(ctx) {
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.rotate((i / 6) * Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -0.85);
      ctx.moveTo(0, -0.5);
      ctx.lineTo(-0.22, -0.7);
      ctx.moveTo(0, -0.5);
      ctx.lineTo(0.22, -0.7);
      ctx.lineWidth = 0.22;
      ctx.strokeStyle = OUT;
      ctx.stroke();
      ctx.lineWidth = 0.12;
      ctx.strokeStyle = '#e8f8ff';
      ctx.stroke();
      ctx.restore();
    }
  },
  arrows(ctx) {
    arrowShape(ctx, -0.7, -0.7, 0.35, 0.55);
    arrowShape(ctx, -0.25, -0.85, 0.75, 0.35);
    arrowShape(ctx, -0.85, -0.2, 0.0, 0.8);
  },
  golem(ctx) {
    ctx.beginPath();
    ctx.moveTo(-0.7, 0.6);
    ctx.lineTo(-0.8, -0.2);
    ctx.lineTo(-0.4, -0.75);
    ctx.lineTo(0.35, -0.8);
    ctx.lineTo(0.8, -0.25);
    ctx.lineTo(0.7, 0.6);
    ctx.closePath();
    fillS(ctx, '#8a7a68');
    ctx.beginPath();
    ctx.moveTo(-0.5, -0.4);
    ctx.lineTo(-0.2, -0.1);
    ctx.moveTo(0.4, 0.1);
    ctx.lineTo(0.55, 0.45);
    stroke(ctx, 0.05);
    eyes(ctx, -0.15, 0.25, 0.1, '#9affd0');
    ctx.fillStyle = OUT;
    ctx.fillRect(-0.3, 0.2, 0.6, 0.1);
  },
  golemite(ctx) {
    DRAW.golem(ctx);
  },
  assassin(ctx) {
    ctx.beginPath();
    ctx.moveTo(-0.6, 0.65);
    ctx.quadraticCurveTo(-0.65, -0.6, 0, -0.8);
    ctx.quadraticCurveTo(0.65, -0.6, 0.6, 0.65);
    ctx.closePath();
    fillS(ctx, '#3a3a5a');
    ctx.beginPath();
    ctx.ellipse(0, 0.05, 0.38, 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#15131f';
    ctx.fill();
    eyes(ctx, 0.0, 0.15, 0.06, '#ff5a8a');
    // 단검
    ctx.beginPath();
    ctx.moveTo(0.35, 0.5);
    ctx.lineTo(0.95, -0.25);
    ctx.lineTo(0.85, -0.35);
    ctx.lineTo(0.3, 0.35);
    ctx.closePath();
    fillS(ctx, '#e8e8f0', 0.05);
  },
  musketeer(ctx) {
    circle(ctx, 0, 0.15, 0.42);
    fillS(ctx, '#f3c9a0');
    eyes(ctx, 0.1, 0.15, 0.05);
    ctx.beginPath();
    ctx.ellipse(0, -0.2, 0.75, 0.2, 0, 0, Math.PI * 2);
    fillS(ctx, '#3a4a8a');
    ctx.beginPath();
    ctx.rect(-0.35, -0.6, 0.7, 0.42);
    fillS(ctx, '#3a4a8a');
    ctx.beginPath();
    ctx.moveTo(0.3, -0.55);
    ctx.quadraticCurveTo(0.7, -0.9, 0.85, -0.5);
    fillS(ctx, '#f0f0f0', 0.05);
    ctx.beginPath();
    ctx.moveTo(-0.9, 0.9);
    ctx.lineTo(0.2, 0.5);
    ctx.lineWidth = 0.14;
    ctx.strokeStyle = '#5a3a1a';
    ctx.stroke();
  },
  bats(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, -0.1);
    ctx.quadraticCurveTo(-0.5, -0.7, -1.0, -0.3);
    ctx.quadraticCurveTo(-0.75, -0.05, -0.8, 0.25);
    ctx.quadraticCurveTo(-0.5, 0.0, -0.35, 0.3);
    ctx.lineTo(0, 0.1);
    ctx.lineTo(0.35, 0.3);
    ctx.quadraticCurveTo(0.5, 0.0, 0.8, 0.25);
    ctx.quadraticCurveTo(0.75, -0.05, 1.0, -0.3);
    ctx.quadraticCurveTo(0.5, -0.7, 0, -0.1);
    fillS(ctx, '#5a3a7a');
    circle(ctx, 0, 0.05, 0.28);
    fillS(ctx, '#6a4a8a');
    eyes(ctx, 0.0, 0.1, 0.05, '#ffe36b');
  },
  valkyrie(ctx) {
    circle(ctx, 0, 0.2, 0.42);
    fillS(ctx, '#f3c9a0');
    eyes(ctx, 0.15, 0.14, 0.05);
    ctx.beginPath();
    ctx.moveTo(-0.45, 0.15);
    ctx.quadraticCurveTo(-0.5, -0.4, 0, -0.4);
    ctx.quadraticCurveTo(0.5, -0.4, 0.45, 0.15);
    ctx.quadraticCurveTo(0, -0.1, -0.45, 0.15);
    fillS(ctx, '#e89a2a', 0.06);
    // 도끼
    ctx.beginPath();
    ctx.moveTo(0.2, -0.95);
    ctx.lineTo(0.2, 0.9);
    ctx.lineWidth = 0.1;
    ctx.strokeStyle = '#7a4a1a';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0.2, -0.85);
    ctx.quadraticCurveTo(0.95, -0.9, 0.85, -0.3);
    ctx.lineTo(0.2, -0.45);
    ctx.closePath();
    fillS(ctx, '#d8dce8', 0.05);
  },
};

// 유물 아이콘
const RELIC_DRAW = {
  drop(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, -0.9);
    ctx.bezierCurveTo(0.5, -0.3, 0.7, 0.1, 0.6, 0.35);
    ctx.arc(0, 0.35, 0.6, 0, Math.PI);
    ctx.bezierCurveTo(-0.7, 0.1, -0.5, -0.3, 0, -0.9);
    fillS(ctx, '#d060f0');
  },
  book(ctx) {
    ctx.beginPath();
    ctx.rect(-0.7, -0.6, 1.4, 1.2);
    fillS(ctx, '#a0503a');
    ctx.beginPath();
    ctx.rect(-0.55, -0.5, 1.1, 1.0);
    fillS(ctx, '#f4e8c8', 0.05);
    star(ctx, 0, 0, 0.35);
    fillS(ctx, '#ffd040', 0.05);
  },
  wall(ctx) {
    ctx.beginPath();
    ctx.rect(-0.8, -0.4, 1.6, 1.1);
    fillS(ctx, '#b8b0a0');
    ctx.fillStyle = '#b8b0a0';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.rect(-0.8 + i * 0.45, -0.75, 0.25, 0.35);
      fillS(ctx, '#c8c0b0', 0.06);
    }
    ctx.beginPath();
    ctx.moveTo(-0.8, 0.15);
    ctx.lineTo(0.8, 0.15);
    ctx.moveTo(0, -0.4);
    ctx.lineTo(0, 0.15);
    stroke(ctx, 0.05);
  },
  scroll(ctx) {
    ctx.beginPath();
    ctx.rect(-0.55, -0.7, 1.1, 1.4);
    fillS(ctx, '#f4e0b0');
    ctx.beginPath();
    ctx.ellipse(0, -0.7, 0.65, 0.14, 0, 0, Math.PI * 2);
    fillS(ctx, '#d8b880', 0.05);
    ctx.beginPath();
    ctx.ellipse(0, 0.7, 0.65, 0.14, 0, 0, Math.PI * 2);
    fillS(ctx, '#d8b880', 0.05);
    star(ctx, 0, 0, 0.3, 4, 0.35);
    fillS(ctx, '#8a5ae0', 0.04);
  },
  heart(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, 0.8);
    ctx.bezierCurveTo(-1.2, -0.1, -0.5, -1.0, 0, -0.4);
    ctx.bezierCurveTo(0.5, -1.0, 1.2, -0.1, 0, 0.8);
    fillS(ctx, '#50d080');
  },
  flask(ctx) {
    ctx.beginPath();
    ctx.moveTo(-0.2, -0.85);
    ctx.lineTo(-0.2, -0.3);
    ctx.lineTo(-0.7, 0.7);
    ctx.lineTo(0.7, 0.7);
    ctx.lineTo(0.2, -0.3);
    ctx.lineTo(0.2, -0.85);
    ctx.closePath();
    fillS(ctx, '#e8f0ff');
    ctx.beginPath();
    ctx.moveTo(-0.45, 0.2);
    ctx.lineTo(-0.66, 0.66);
    ctx.lineTo(0.66, 0.66);
    ctx.lineTo(0.45, 0.2);
    ctx.closePath();
    ctx.fillStyle = '#d060f0';
    ctx.fill();
  },
  flag(ctx) {
    ctx.beginPath();
    ctx.moveTo(-0.5, 0.9);
    ctx.lineTo(-0.5, -0.9);
    ctx.lineWidth = 0.12;
    ctx.strokeStyle = '#6a4a2a';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-0.45, -0.85);
    ctx.lineTo(0.8, -0.55);
    ctx.lineTo(-0.45, -0.15);
    ctx.closePath();
    fillS(ctx, '#4a8ae0');
  },
  drum(ctx) {
    ctx.beginPath();
    ctx.rect(-0.7, -0.3, 1.4, 0.8);
    fillS(ctx, '#c0503a');
    ctx.beginPath();
    ctx.ellipse(0, -0.3, 0.7, 0.25, 0, 0, Math.PI * 2);
    fillS(ctx, '#f0e0c0');
    ctx.beginPath();
    ctx.moveTo(-0.7, -0.2);
    ctx.lineTo(0, 0.5);
    ctx.lineTo(0.7, -0.2);
    stroke(ctx, 0.06);
  },
  crown(ctx) {
    ctx.beginPath();
    ctx.moveTo(-0.8, 0.5);
    ctx.lineTo(-0.85, -0.4);
    ctx.lineTo(-0.4, 0.0);
    ctx.lineTo(0, -0.6);
    ctx.lineTo(0.4, 0.0);
    ctx.lineTo(0.85, -0.4);
    ctx.lineTo(0.8, 0.5);
    ctx.closePath();
    fillS(ctx, '#ffd040');
  },
  hammer(ctx) {
    ctx.beginPath();
    ctx.moveTo(-0.6, 0.8);
    ctx.lineTo(0.3, -0.2);
    ctx.lineWidth = 0.16;
    ctx.strokeStyle = '#8a5a2a';
    ctx.stroke();
    ctx.save();
    ctx.translate(0.35, -0.3);
    ctx.rotate(-0.8);
    ctx.beginPath();
    ctx.rect(-0.55, -0.25, 1.1, 0.5);
    fillS(ctx, '#8a8a9a');
    ctx.restore();
  },
  shield(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, -0.85);
    ctx.lineTo(0.7, -0.6);
    ctx.quadraticCurveTo(0.7, 0.5, 0, 0.9);
    ctx.quadraticCurveTo(-0.7, 0.5, -0.7, -0.6);
    ctx.closePath();
    fillS(ctx, '#4a7ad0');
    ctx.beginPath();
    ctx.moveTo(0, -0.6);
    ctx.lineTo(0, 0.6);
    ctx.moveTo(-0.45, -0.2);
    ctx.lineTo(0.45, -0.2);
    ctx.lineWidth = 0.14;
    ctx.strokeStyle = '#ffd040';
    ctx.stroke();
  },
  thorn(ctx) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.lineTo(Math.cos(a) * 0.9, Math.sin(a) * 0.9);
      ctx.lineTo(Math.cos(a + 0.39) * 0.4, Math.sin(a + 0.39) * 0.4);
    }
    ctx.closePath();
    fillS(ctx, '#6a9a4a');
  },
};

export function drawIcon(ctx, id, size) {
  const f = DRAW[id] || RELIC_DRAW[id];
  if (!f) return;
  ctx.save();
  ctx.scale(size, size);
  f(ctx);
  ctx.restore();
}

const cache = new Map();
// 아이콘을 비트맵으로 캐시 (px 크기)
export function iconBitmap(id, px) {
  const key = id + '@' + px;
  let c = cache.get(key);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = px;
  const g = c.getContext('2d');
  g.translate(px / 2, px / 2);
  drawIcon(g, id, px * 0.42);
  cache.set(key, c);
  return c;
}

export function iconDataURL(id, px = 96, bg = null) {
  const c = document.createElement('canvas');
  c.width = c.height = px;
  const g = c.getContext('2d');
  if (bg) {
    g.fillStyle = bg;
    g.beginPath();
    g.arc(px / 2, px / 2, px / 2 - 2, 0, Math.PI * 2);
    g.fill();
  }
  g.translate(px / 2, px / 2);
  drawIcon(g, id, px * 0.36);
  return c.toDataURL();
}

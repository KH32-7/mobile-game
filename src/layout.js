// 스테이지 레이아웃 계산: 벨트, 주방, 부두, 설거지대, 좌석 위치
import { MENUS } from './config.js';

export const COUNTER_IN = 0.5; // 벨트 중심선 안쪽 카운터 폭
export const COUNTER_OUT = 0.85; // 바깥쪽 카운터 폭
export const STOOL = 1.28; // 벨트 중심선에서 의자까지

export function buildLayout(stage) {
  const L = stage.layout;
  const m = L.mirror ? -1 : 1;
  const r = L.r;
  const topZ = L.topZ;
  const nSt = L.menus.length;
  const stSpacing = 2.6;
  const kitchenZ = topZ - r - 5.2; // 조리대 중심
  const dockZ = kitchenZ - 2.55; // 부두 상자 줄
  // 식당마다 벨트 간격과 엇갈림(B 벨트 위치)을 다르게 해서 레이아웃이 달라 보이게 함
  const gap = L.gap || 3.9;
  const bOff = L.bOff || 0;
  const beltCx = L.twoBelts ? [-gap * m, gap * m] : [0];
  const belts = beltCx.map((cx, i) => ({ id: i === 0 ? 'A' : 'B', cx, topZ: topZ + (i === 1 ? bOff : 0), r, len0: L.len0, len1: L.len1 }));

  const stHalf = ((nSt - 1) / 2) * stSpacing;
  const stations = L.menus.map((menu, i) => {
    const x = (-stHalf + i * stSpacing) * m;
    return {
      menu,
      ing: MENUS[menu].ing,
      x,
      z: kitchenZ,
      padIn: { x: x - 0.63, z: kitchenZ + 1.2 },
      padOut: { x: x + 0.63, z: kitchenZ + 1.2 },
      // 부두 상자는 조리대 사이 통로 뒤에 두어서 앞뒤로 바로 오갈 수 있게 함
      crate: { x: x + 1.3 * m, z: dockZ, pad: { x: x + 1.3 * m, z: dockZ + 1.05 } },
    };
  });
  const rackX = (stHalf + 2.15) * m;
  const sinkX = (stHalf + 3.95) * m;
  const rack = { x: rackX, z: kitchenZ };
  const sink = { x: sinkX, z: kitchenZ, pad: { x: sinkX, z: kitchenZ + 1.2 } };

  const halfW = Math.max(L.twoBelts ? gap + 4.7 : 6.4, Math.abs(sinkX) + 1.6);
  const bottomZ = topZ + Math.max(0, bOff) + L.len1 + r + 4.4;
  const backZ = dockZ - 1.2;

  const feeds = belts.map((b) => ({ x: b.cx, z: b.topZ - r - 1.35, belt: b.id }));
  const trashes = belts.map((b, i) => {
    const side = L.twoBelts ? (i === 0 ? -1 : 1) : m;
    return { x: b.cx + side * 1.95, z: b.topZ - r - 1.0, bin: { x: b.cx + side * 2.75, z: b.topZ - r - 1.25 }, belt: b.id };
  });

  const upgrade = { x: (halfW - 2.0) * m, z: bottomZ - 2.3, desk: { x: (halfW - 0.9) * m, z: bottomZ - 2.3 } };
  const nextPad = { x: -(halfW - 2.0) * m, z: bottomZ - 2.3 };
  const door = { x: 0, z: bottomZ };
  const extPad = { x: belts[0].cx, z: topZ + L.len1 + r + COUNTER_OUT + 0.95 };
  const lever = belts[1] ? { x: belts[1].cx, z: feeds[1].z, model: { x: belts[1].cx + 0.9 * (belts[1].cx > 0 ? 1 : -1), z: feeds[1].z - 0.3 } } : null;

  // 쇼핑몰 에스컬레이터 (왼쪽 앞)
  const escalator = stage.theme === 'mall' ? { x: -(halfW - 0.55) * m, z: bottomZ - 1.2 } : null;
  const idle = {
    runner: { x: belts[0].cx + 0.9 * m, z: topZ - r - 2.4 },
    hauler: { x: -stHalf * m, z: kitchenZ + 2.2 },
  };

  return {
    m,
    r,
    topZ,
    kitchenZ,
    dockZ,
    belts,
    stations,
    rack,
    sink,
    feeds,
    trashes,
    upgrade,
    nextPad,
    door,
    extPad,
    lever,
    idle,
    escalator,
    bounds: { x0: -halfW, x1: halfW, z0: backZ, z1: bottomZ },
    halfW,
    backZ,
    bottomZ,
  };
}

// 좌석 id -> 위치 (현재 벨트 길이 기준)
export function seatInfo(id, belt, len) {
  const [, side, k] = id.split('-');
  const d = 0.5 + Number(k) * 1.0;
  const r = belt.r;
  const z = belt.topZ + d;
  if (side === 'R') {
    return { d, side, x: belt.cx + r + STOOL, z, ry: -Math.PI / 2, s: d, cx: belt.cx + r + 0.58, cz: z };
  }
  const L = 2 * len + 2 * Math.PI * r;
  return { d, side, x: belt.cx - r - STOOL, z, ry: Math.PI / 2, s: (len + Math.PI * r + (len - d)) % L, cx: belt.cx - r - 0.58, cz: z };
}

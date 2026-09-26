const KEY = 'void-maw-save-v1';

const defaults = () => ({
  coins: 0,
  best: { time: 0, size: 0, kills: 0, swallowed: 0, cleared: false },
  upg: { size: 0, hp: 0, speed: 0, xp: 0 },
  muted: false,
  tutorialDone: false,
  runs: 0,
});

export const Save = {
  data: defaults(),
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        const base = defaults();
        this.data = { ...base, ...d, best: { ...base.best, ...(d.best || {}) }, upg: { ...base.upg, ...(d.upg || {}) } };
      }
    } catch (e) {
      this.data = defaults();
    }
    return this.data;
  },
  save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch (e) {
      /* 저장 불가 환경 */
    }
  },
};

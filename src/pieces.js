// Block Blast 표준 조각 셋
function parse(rows) {
  const cells = [];
  rows.forEach((row, r) => { [...row].forEach((ch, c) => { if (ch === '#') cells.push([r, c]); }); });
  return cells;
}

function def(id, rows, weight, tags = []) {
  const cells = parse(rows);
  const h = rows.length, w = Math.max(...rows.map((r) => r.length));
  return { id, cells, w, h, size: cells.length, weight, tags };
}

export const SHAPES = [
  def('dot', ['#'], 3, ['small']),
  def('i2h', ['##'], 4, ['small', 'bar']),
  def('i2v', ['#', '#'], 4, ['small', 'bar']),
  def('i3h', ['###'], 5, ['bar']),
  def('i3v', ['#', '#', '#'], 5, ['bar']),
  def('l3a', ['##', '#.'], 3),
  def('l3b', ['##', '.#'], 3),
  def('l3c', ['#.', '##'], 3),
  def('l3d', ['.#', '##'], 3),
  def('i4h', ['####'], 4, ['bar', 'long']),
  def('i4v', ['#', '#', '#', '#'], 4, ['bar', 'long']),
  def('o2', ['##', '##'], 6, ['square']),
  def('l4a', ['#.', '#.', '##'], 2),
  def('l4b', ['.#', '.#', '##'], 2),
  def('l4c', ['##', '#.', '#.'], 2),
  def('l4d', ['##', '.#', '.#'], 2),
  def('l4e', ['###', '#..'], 2),
  def('l4f', ['###', '..#'], 2),
  def('l4g', ['#..', '###'], 2),
  def('l4h', ['..#', '###'], 2),
  def('t4a', ['###', '.#.'], 2.5),
  def('t4b', ['.#.', '###'], 2.5),
  def('t4c', ['#.', '##', '#.'], 2.5),
  def('t4d', ['.#', '##', '.#'], 2.5),
  def('s4a', ['.##', '##.'], 2),
  def('s4b', ['##.', '.##'], 2),
  def('s4c', ['#.', '##', '.#'], 2),
  def('s4d', ['.#', '##', '#.'], 2),
  def('i5h', ['#####'], 3, ['bar', 'long']),
  def('i5v', ['#', '#', '#', '#', '#'], 3, ['bar', 'long']),
  def('bl5a', ['#..', '#..', '###'], 2),
  def('bl5b', ['..#', '..#', '###'], 2),
  def('bl5c', ['###', '#..', '#..'], 2),
  def('bl5d', ['###', '..#', '..#'], 2),
  def('r6h', ['###', '###'], 3),
  def('r6v', ['##', '##', '##'], 3),
  def('o3', ['###', '###', '###'], 3, ['big']),
];

export const SHAPE_BY_ID = Object.fromEntries(SHAPES.map((s) => [s.id, s]));

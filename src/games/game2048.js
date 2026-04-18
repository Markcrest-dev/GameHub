export const SIZE = 4;

export function createGrid() {
  const g = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
  return addTile(addTile(g));
}

export function addTile(grid) {
  const empty = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!grid[r][c]) empty.push([r, c]);
  if (!empty.length) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = grid.map(row => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRow(row) {
  const vals = row.filter(x => x !== 0);
  const merged = [];
  let score = 0;
  let i = 0;
  while (i < vals.length) {
    if (i + 1 < vals.length && vals[i] === vals[i + 1]) {
      merged.push(vals[i] * 2);
      score += vals[i] * 2;
      i += 2;
    } else {
      merged.push(vals[i]);
      i++;
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, score };
}

function transpose(grid) {
  return grid[0].map((_, c) => grid.map(row => row[c]));
}

export function move(grid, direction) {
  let g = grid.map(r => [...r]);
  let totalScore = 0;
  let moved = false;

  const processRows = (rows, reverse) => rows.map(row => {
    const ordered = reverse ? [...row].reverse() : [...row];
    const { row: slid, score } = slideRow(ordered);
    totalScore += score;
    const result = reverse ? slid.reverse() : slid;
    if (result.some((v, i) => v !== row[i])) moved = true;
    return result;
  });

  if (direction === 'left')  g = processRows(g, false);
  if (direction === 'right') g = processRows(g, true);
  if (direction === 'up')    g = transpose(processRows(transpose(g), false));
  if (direction === 'down')  g = transpose(processRows(transpose(g), true));

  if (moved) g = addTile(g);
  return { grid: g, score: totalScore, moved };
}

export function hasWon(grid) {
  return grid.some(row => row.some(v => v === 2048));
}

export function isGameOver(grid) {
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) return false;
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return false;
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return false;
    }
  return true;
}

export function tileColor(value) {
  const map = {
    2:    '#1a1a2e', 4:    '#16213e', 8:    '#0f3460',
    16:   '#533483', 32:   '#e94560', 64:   '#e94560',
    128:  '#ff6b35', 256:  '#ff8800', 512:  '#ff00ff',
    1024: '#00ffff', 2048: '#ffff00',
  };
  return map[value] || '#ffff00';
}

export function tileFontColor(value) {
  return value <= 4 ? '#aaaaaa' : '#ffffff';
}

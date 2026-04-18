export const BOARD_W = 10;
export const BOARD_H = 20;

export const TETROMINOS = {
  I: { color: '#00ffff', shapes: [
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
    [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
  ]},
  O: { color: '#ffff00', shapes: [
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
  ]},
  T: { color: '#ff00ff', shapes: [
    [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]],
    [[0,0,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0]],
    [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
  ]},
  S: { color: '#00ff41', shapes: [
    [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]],
    [[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],
    [[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
  ]},
  Z: { color: '#ff2244', shapes: [
    [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]],
    [[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],
    [[0,1,0,0],[1,1,0,0],[1,0,0,0],[0,0,0,0]],
  ]},
  J: { color: '#4466ff', shapes: [
    [[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
    [[0,0,0,0],[1,1,1,0],[0,0,1,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]],
  ]},
  L: { color: '#ff8800', shapes: [
    [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
    [[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]],
    [[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],
    [[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
  ]},
};

export const PIECE_TYPES = Object.keys(TETROMINOS);

export function createBoard() {
  return Array(BOARD_H).fill(null).map(() => Array(BOARD_W).fill(null));
}

export function randomPiece() {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return { type, x: 3, y: -1, rotation: 0 };
}

export function getShape(piece) {
  const t = TETROMINOS[piece.type];
  return t.shapes[piece.rotation % t.shapes.length];
}

export function canPlace(board, piece, dx = 0, dy = 0, dr = 0) {
  const testPiece = { ...piece, x: piece.x + dx, y: piece.y + dy, rotation: (piece.rotation + dr + 4) % 4 };
  const shape = getShape(testPiece);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const bx = testPiece.x + c;
      const by = testPiece.y + r;
      if (bx < 0 || bx >= BOARD_W || by >= BOARD_H) return false;
      if (by >= 0 && board[by][bx]) return false;
    }
  }
  return true;
}

export function placePiece(board, piece) {
  const newBoard = board.map(row => [...row]);
  const shape = getShape(piece);
  const color = TETROMINOS[piece.type].color;
  shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) {
        const bx = piece.x + c;
        const by = piece.y + r;
        if (by >= 0 && by < BOARD_H && bx >= 0 && bx < BOARD_W) {
          newBoard[by][bx] = color;
        }
      }
    });
  });
  return newBoard;
}

export function clearLines(board) {
  const kept = board.filter(row => row.some(cell => !cell));
  const cleared = BOARD_H - kept.length;
  const empty = Array(cleared).fill(null).map(() => Array(BOARD_W).fill(null));
  return { board: [...empty, ...kept], linesCleared: cleared };
}

export function getScore(lines, level) {
  const base = [0, 100, 300, 500, 800];
  return (base[lines] || 0) * (level + 1);
}

export function getDisplayBoard(board, piece) {
  const display = board.map(row => [...row]);
  if (!piece) return display;
  const shape = getShape(piece);
  const color = TETROMINOS[piece.type].color;
  shape.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell) {
        const bx = piece.x + c;
        const by = piece.y + r;
        if (by >= 0 && by < BOARD_H && bx >= 0 && bx < BOARD_W) {
          display[by][bx] = color;
        }
      }
    });
  });
  return display;
}

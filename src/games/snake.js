export const GRID_SIZE = 20;

export const DIR = {
  UP:    { x: 0,  y: -1 },
  DOWN:  { x: 0,  y:  1 },
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x:  1, y:  0 },
};

export const OPPOSITE = {
  UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
};

export function createInitialState() {
  return {
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    direction: 'RIGHT',
    food: { x: 5, y: 5 },
    score: 0,
    gameOver: false,
    speed: 180,
  };
}

export function randomFood(snake) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

export function tick(state) {
  const { snake, direction, food, score } = state;
  const dir = DIR[direction];
  const head = snake[0];
  const newHead = { x: head.x + dir.x, y: head.y + dir.y };

  // Wall collision
  if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
    return { ...state, gameOver: true };
  }
  // Self collision
  if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
    return { ...state, gameOver: true };
  }

  const ateFood = newHead.x === food.x && newHead.y === food.y;
  const newSnake = ateFood ? [newHead, ...snake] : [newHead, ...snake.slice(0, -1)];
  const newScore = ateFood ? score + 10 : score;
  const newFood  = ateFood ? randomFood(newSnake) : food;
  // Speed up every 5 food items eaten
  const foodEaten = (newSnake.length - 3); // initial length 3
  const newSpeed  = ateFood ? Math.max(80, 180 - Math.floor(foodEaten / 5) * 15) : state.speed;

  return { ...state, snake: newSnake, food: newFood, score: newScore, speed: newSpeed };
}

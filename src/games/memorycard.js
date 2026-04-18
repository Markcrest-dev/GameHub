const EMOJI_POOL = [
  '🎮','👾','🚀','💎','⚡','🔥','🌈','🎯',
  '🏆','🎸','🌙','❄️','🐉','🦊','🎪','🍕',
  '🤖','🎭','💫','🌊','🦄','🎲','🔮','🎺',
];

export const DIFFICULTIES = {
  easy:   { pairs: 6,  cols: 3, label: 'EASY' },
  medium: { pairs: 8,  cols: 4, label: 'MEDIUM' },
  hard:   { pairs: 12, cols: 4, label: 'HARD' },
};

export function createCards(difficulty = 'medium') {
  const { pairs } = DIFFICULTIES[difficulty];
  const emojis = EMOJI_POOL.slice(0, pairs);
  const doubled = [...emojis, ...emojis];
  const shuffled = doubled.sort(() => Math.random() - 0.5);
  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

export function flipCard(cards, id) {
  return cards.map(card =>
    card.id === id ? { ...card, isFlipped: true } : card
  );
}

export function checkMatch(cards, firstId, secondId) {
  const first = cards.find(c => c.id === firstId);
  const second = cards.find(c => c.id === secondId);
  const matched = first.emoji === second.emoji;
  if (matched) {
    return {
      cards: cards.map(c =>
        c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
      ),
      matched: true,
    };
  }
  return {
    cards: cards.map(c =>
      c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
    ),
    matched: false,
  };
}

export function isGameComplete(cards) {
  return cards.every(c => c.isMatched);
}

export function calcMemoryScore(pairs, moves, timeElapsed) {
  const base = pairs * 100;
  const movePenalty = Math.max(0, (moves - pairs) * 5);
  const timeBonus = Math.max(0, 300 - timeElapsed);
  return Math.max(0, base - movePenalty + timeBonus);
}

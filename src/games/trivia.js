export const CATEGORIES = ['Science', 'History', 'Pop Culture', 'Geography', 'Technology', 'Sports'];

export const QUESTIONS = [
  // Science
  { q: 'What is the chemical symbol for gold?', options: ['Au', 'Ag', 'Gd', 'Go'], answer: 0, category: 'Science' },
  { q: 'How many bones are in the adult human body?', options: ['206', '208', '212', '196'], answer: 0, category: 'Science' },
  { q: 'What planet is closest to the Sun?', options: ['Mercury', 'Venus', 'Mars', 'Earth'], answer: 0, category: 'Science' },
  { q: 'What is the speed of light (approx)?', options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10⁷ m/s', '3×10⁹ m/s'], answer: 0, category: 'Science' },
  { q: 'What gas do plants absorb from the air?', options: ['CO₂', 'O₂', 'N₂', 'H₂'], answer: 0, category: 'Science' },
  { q: 'What is the powerhouse of the cell?', options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Vacuole'], answer: 0, category: 'Science' },
  { q: 'How many chromosomes do humans have?', options: ['46', '48', '44', '42'], answer: 0, category: 'Science' },
  { q: 'What force keeps planets in orbit?', options: ['Gravity', 'Magnetism', 'Friction', 'Tension'], answer: 0, category: 'Science' },

  // History
  { q: 'In what year did WW2 end?', options: ['1945', '1944', '1946', '1943'], answer: 0, category: 'History' },
  { q: 'Who was the first US President?', options: ['George Washington', 'John Adams', 'Thomas Jefferson', 'Abraham Lincoln'], answer: 0, category: 'History' },
  { q: 'The Berlin Wall fell in which year?', options: ['1989', '1991', '1987', '1985'], answer: 0, category: 'History' },
  { q: 'Which empire was ruled by Julius Caesar?', options: ['Roman', 'Greek', 'Ottoman', 'Byzantine'], answer: 0, category: 'History' },
  { q: 'Who wrote the Magna Carta era in England?', options: ['King John', 'King Henry', 'King Richard', 'King Edward'], answer: 0, category: 'History' },
  { q: 'The French Revolution began in which year?', options: ['1789', '1776', '1804', '1799'], answer: 0, category: 'History' },
  { q: 'Who was Egypts most famous female pharaoh?', options: ['Cleopatra', 'Nefertiti', 'Hatshepsut', 'Isis'], answer: 2, category: 'History' },
  { q: 'Which country first landed on the Moon?', options: ['USA', 'USSR', 'China', 'UK'], answer: 0, category: 'History' },

  // Pop Culture
  { q: 'How many Infinity Stones are in the MCU?', options: ['6', '5', '7', '4'], answer: 0, category: 'Pop Culture' },
  { q: 'Who played Iron Man in the MCU?', options: ['Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo'], answer: 0, category: 'Pop Culture' },
  { q: 'What year was the first iPhone released?', options: ['2007', '2006', '2008', '2005'], answer: 0, category: 'Pop Culture' },
  { q: 'Which band performed "Bohemian Rhapsody"?', options: ['Queen', 'The Beatles', 'Led Zeppelin', 'Pink Floyd'], answer: 0, category: 'Pop Culture' },
  { q: 'In which city does Batman primarily operate?', options: ['Gotham', 'Metropolis', 'Star City', 'Central City'], answer: 0, category: 'Pop Culture' },
  { q: 'What is the highest-grossing film of all time?', options: ['Avatar', 'Endgame', 'Titanic', 'Star Wars'], answer: 0, category: 'Pop Culture' },
  { q: 'Who sang "Thriller"?', options: ['Michael Jackson', 'Prince', 'David Bowie', 'Freddie Mercury'], answer: 0, category: 'Pop Culture' },
  { q: 'What console introduced the D-pad?', options: ['Game & Watch', 'Atari', 'ColecoVision', 'NES'], answer: 0, category: 'Pop Culture' },

  // Geography
  { q: 'What is the largest ocean?', options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], answer: 0, category: 'Geography' },
  { q: 'Which country has the most natural lakes?', options: ['Canada', 'Russia', 'USA', 'Finland'], answer: 0, category: 'Geography' },
  { q: 'What is the capital of Australia?', options: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], answer: 0, category: 'Geography' },
  { q: 'Which is the longest river?', options: ['Nile', 'Amazon', 'Mississippi', 'Yangtze'], answer: 0, category: 'Geography' },
  { q: 'Which continent has the most countries?', options: ['Africa', 'Asia', 'Europe', 'Americas'], answer: 0, category: 'Geography' },
  { q: 'What is the smallest country in the world?', options: ['Vatican City', 'Monaco', 'San Marino', 'Liechtenstein'], answer: 0, category: 'Geography' },
  { q: 'Mount Everest is in which mountain range?', options: ['Himalayas', 'Andes', 'Alps', 'Rockies'], answer: 0, category: 'Geography' },
  { q: 'Which country has the longest coastline?', options: ['Canada', 'Russia', 'Australia', 'Norway'], answer: 0, category: 'Geography' },

  // Technology
  { q: 'What does CPU stand for?', options: ['Central Processing Unit', 'Core Power Unit', 'Central Program Utility', 'Computer Processing Unit'], answer: 0, category: 'Technology' },
  { q: 'Who co-founded Apple with Steve Jobs?', options: ['Steve Wozniak', 'Bill Gates', 'Paul Allen', 'Michael Dell'], answer: 0, category: 'Technology' },
  { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Transfer Markup Language', 'HyperText Modeling Language', 'High Text Markup Logic'], answer: 0, category: 'Technology' },
  { q: 'In what year was the World Wide Web invented?', options: ['1989', '1991', '1985', '1994'], answer: 0, category: 'Technology' },
  { q: 'What language is primarily used for iOS apps?', options: ['Swift', 'Kotlin', 'Java', 'Dart'], answer: 0, category: 'Technology' },
  { q: 'What does RAM stand for?', options: ['Random Access Memory', 'Read Access Memory', 'Run Application Memory', 'Rapid Access Module'], answer: 0, category: 'Technology' },

  // Sports
  { q: 'How many players in a basketball team on court?', options: ['5', '6', '4', '7'], answer: 0, category: 'Sports' },
  { q: 'In which sport is a "birdie" a score term?', options: ['Golf', 'Tennis', 'Badminton', 'Cricket'], answer: 0, category: 'Sports' },
  { q: 'How often are the Summer Olympics held?', options: ['Every 4 years', 'Every 2 years', 'Every 3 years', 'Every 5 years'], answer: 0, category: 'Sports' },
  { q: 'What country invented the game of chess?', options: ['India', 'China', 'Persia', 'Greece'], answer: 0, category: 'Sports' },
];

export function getRandomQuestions(count = 10) {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(q => {
    const opts = [...q.options];
    const correct = opts[q.answer];
    opts.sort(() => Math.random() - 0.5);
    return { ...q, options: opts, answer: opts.indexOf(correct) };
  });
}

export function calcScore(basePoints, timeLeft, maxTime) {
  const timeBonus = Math.floor((timeLeft / maxTime) * basePoints);
  return basePoints + timeBonus;
}

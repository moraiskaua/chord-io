export const NOTE_TO_INDEX = {
  C: 0,
  'C#': 1,
  D: 2,
  'D#': 3,
  E: 4,
  F: 5,
  'F#': 6,
  G: 7,
  'G#': 8,
  A: 9,
  'A#': 10,
  B: 11,
};

export const INDEX_TO_NOTE = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const CHORD_DEFINITIONS = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  '7': [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
  dim: [0, 3, 6],
  m7b5: [0, 3, 6, 10],
  aug: [0, 4, 8],
  '9': [0, 4, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  m9: [0, 3, 7, 10, 14],
};

export const DIFFICULTY_LABELS = {
  easy: 'Fácil',
  medium: 'Médio',
  hard: 'Difícil',
};

export const DIFFICULTY_DESCRIPTIONS = {
  easy: 'Reconheça acordes maiores e menores básicos',
  medium: 'Reconheça acordes com 7ª e 9ª',
  hard: 'Reconheça acordes diminutos e meio-diminutos',
};

export const DIFFICULTY_COLORS = {
  easy: 'bg-green-600 hover:bg-green-700',
  medium: 'bg-amber-600 hover:bg-amber-700',
  hard: 'bg-rose-600 hover:bg-rose-700',
};

export const DIFFICULTY_BORDERS = {
  easy: 'border-green-200',
  medium: 'border-amber-200',
  hard: 'border-rose-200',
};

export const DIFFICULTY_ACTIVE_STATES = {
  easy: 'data-[state=active]:bg-green-100 data-[state=active]:text-green-800',
  medium: 'data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800',
  hard: 'data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800',
};

export const MAX_ATTEMPTS = 5;

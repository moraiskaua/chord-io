export const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};

export const INDEX_TO_NOTE: Record<number, string> = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B',
};

export const CHORD_DEFINITIONS = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  '7': [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  '6': [0, 4, 7, 9],
  m6: [0, 3, 7, 9],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus4: [0, 5, 7],
  sus2: [0, 2, 7],
  '9': [0, 4, 7, 10, 14],
  m9: [0, 3, 7, 10, 14],
  maj9: [0, 4, 7, 11, 14],
  '7b9': [0, 4, 7, 10, 13],
  '7#9': [0, 4, 7, 10, 15],
  '7#11': [0, 4, 7, 10, 18],
  m7b5: [0, 3, 6, 10],
  '13': [0, 4, 7, 10, 14, 21],
  maj13: [0, 4, 7, 11, 14, 21],
  m11: [0, 3, 7, 10, 14, 17],
  add9: [0, 4, 7, 14],
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

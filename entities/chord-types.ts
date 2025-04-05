export type Difficulty = 'easy' | 'medium' | 'hard';
export type Instrument = 'piano' | 'guitar-acoustic';
export type Octave = '2' | '3' | '4';

export interface ChordData {
  note: string;
  type: string;
  fullChord: string;
}

export interface GameState {
  difficulty: Difficulty;
  attempts: number;
  isPlaying: boolean;
  gameOver: boolean;
  score: number;
  time: number;
}

import { ChordQuality } from './chord-interface';

export enum DifficultyLevel {
  EASY = 'easy',
  HARD = 'hard',
}

export const easyChords = [ChordQuality.MAJOR, ChordQuality.MINOR];

export const hardChord = [
  ChordQuality.MAJOR_SEVENTH,
  ChordQuality.MINOR_SEVENTH,
  ChordQuality.DOMINANT_SEVENTH,
  ChordQuality.MAJOR_NINTH,
  ChordQuality.MINOR_NINTH,
  ChordQuality.DOMINANT_NINTH,
  ChordQuality.DIMINISHED,
  ChordQuality.HALF_DIMINISHED,
];

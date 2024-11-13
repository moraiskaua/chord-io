export enum ChordQuality {
  MAJOR = '',
  MINOR = 'm',
  MAJOR_SEVENTH = 'maj7',
  MINOR_SEVENTH = 'm7',
  DOMINANT_SEVENTH = '7',
  MAJOR_NINTH = 'maj9',
  MINOR_NINTH = 'm9',
  DOMINANT_NINTH = '9',
  DIMINISHED = 'dim',
  HALF_DIMINISHED = 'm7b5',
}

export const chordIntervals = {
  [ChordQuality.MAJOR]: [0, 4, 7],
  [ChordQuality.MINOR]: [0, 3, 7],
  [ChordQuality.MAJOR_SEVENTH]: [0, 4, 7, 11],
  [ChordQuality.MINOR_SEVENTH]: [0, 3, 7, 10],
  [ChordQuality.DOMINANT_SEVENTH]: [0, 4, 7, 10],
  [ChordQuality.MAJOR_NINTH]: [0, 4, 7, 11, 14],
  [ChordQuality.MINOR_NINTH]: [0, 3, 7, 10, 14],
  [ChordQuality.DOMINANT_NINTH]: [0, 4, 7, 10, 14],
  [ChordQuality.DIMINISHED]: [0, 3, 6],
  [ChordQuality.HALF_DIMINISHED]: [0, 3, 6, 10],
};

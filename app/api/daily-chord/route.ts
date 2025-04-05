import { NextResponse } from 'next/server';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const chordTypes = {
  easy: ['', 'm'],
  medium: ['', 'm', '7', 'm7', 'maj7'],
  hard: ['dim', 'm7b5', 'aug', '9', 'maj9', 'm9'],
};

function generateChord(difficulty: 'easy' | 'medium' | 'hard') {
  const note = notes[Math.floor(Math.random() * notes.length)];
  const type =
    chordTypes[difficulty][
      Math.floor(Math.random() * chordTypes[difficulty].length)
    ];
  return { note, type, fullChord: note + type };
}

function getDailyChord(difficulty: 'easy' | 'medium' | 'hard') {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const noteIndex = Math.floor(seededRandom(seed) * notes.length);
  const typeIndex = Math.floor(
    seededRandom(seed + 1) * chordTypes[difficulty].length,
  );

  const note = notes[noteIndex];
  const type = chordTypes[difficulty][typeIndex];

  return { note, type, fullChord: note + type };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const difficulty =
    (searchParams.get('difficulty') as 'easy' | 'medium' | 'hard') || 'easy';
  const mode = searchParams.get('mode') || 'daily';

  if (mode === 'daily') {
    return NextResponse.json(getDailyChord(difficulty));
  } else {
    return NextResponse.json(generateChord(difficulty));
  }
}

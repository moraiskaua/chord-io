import { auth } from '@/lib/auth';
import { encrypt } from '@/lib/encryption';
import { difficultySchema } from '@/schemas/game-schemas';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const chordTypes = {
  easy: ['', 'm', '7', 'maj7'],
  medium: ['m7', '6', 'm6', 'sus4', 'sus2', 'add9', '9'],
  hard: [
    'dim',
    'm7b5',
    'aug',
    'maj9',
    'm9',
    '13',
    'maj13',
    '7b9',
    '7#9',
    '7#11',
    'm11',
  ],
};

export const difficultyDescriptions = {
  easy: 'Acordes básicos que todo músico iniciante deve conhecer. Inclui acordes maiores, menores e sétimas simples.',
  medium:
    'Acordes intermediários com extensões como sextas, suspensões e nonas. Um desafio para músicos com alguma experiência.',
  hard: 'Acordes avançados com extensões complexas, alterações e tensões. Desafio para músicos experientes e profissionais.',
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const result = difficultySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos' },
        { status: 400 },
      );
    }

    const { difficulty } = result.data;

    const today = new Date();
    const baseSeed =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();

    const difficultyOffset =
      difficulty === 'easy' ? 0 : difficulty === 'medium' ? 3000 : 6000;

    const seed = baseSeed + difficultyOffset;

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
    const fullChord = note + type;

    if (!note || type === undefined) {
      return NextResponse.json(
        { success: false, error: 'Falha ao gerar dados do acorde' },
        { status: 500 },
      );
    }

    const chordData = {
      note,
      type,
      fullChord,
      difficulty,
      difficultyDescription: difficultyDescriptions[difficulty],
    };

    const chordId = encrypt(JSON.stringify(chordData));

    (await cookies()).set('chord_token', chordId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
    });

    return NextResponse.json({
      success: true,
      id: chordId,
      difficulty,
      difficultyDescription: difficultyDescriptions[difficulty],
    });
  } catch (error) {
    console.error('Erro ao iniciar jogo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

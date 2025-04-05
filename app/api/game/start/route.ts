import { auth } from '@/lib/auth';
import { encrypt } from '@/lib/encryption';
import { difficultySchema } from '@/schemas/game-schemas';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const chordTypes = {
  easy: ['', 'm'],
  medium: ['', 'm', '7', 'm7', 'maj7'],
  hard: ['dim', 'm7b5', 'aug', '9', 'maj9', 'm9'],
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
    const fullChord = note + type;

    if (!note || !type) {
      return NextResponse.json(
        { success: false, error: 'Falha ao gerar dados do acorde' },
        { status: 500 },
      );
    }

    const chordData = { note, type, fullChord };
    const chordId = encrypt(JSON.stringify(chordData));

    (await cookies()).set('chord_token', chordId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
    });

    return NextResponse.json({ success: true, id: chordId });
  } catch (error) {
    console.error('Erro ao iniciar jogo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

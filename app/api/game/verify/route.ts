import { auth } from '@/lib/auth';
import { decrypt } from '@/lib/encryption';
import { answerSchema } from '@/schemas/game-schemas';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
    const result = answerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Resposta inválida' },
        { status: 400 },
      );
    }

    const { answer } = result.data;
    const chordToken = (await cookies()).get('chord_token')?.value;

    if (!chordToken) {
      return NextResponse.json(
        { success: false, error: 'Sessão inválida' },
        { status: 400 },
      );
    }

    try {
      const chordData = JSON.parse(decrypt(chordToken));

      if (!chordData || !chordData.fullChord) {
        return NextResponse.json(
          { success: false, error: 'Dados do acorde inválidos' },
          { status: 400 },
        );
      }

      const isCorrect =
        answer.toLowerCase() === chordData.fullChord.toLowerCase();

      return NextResponse.json({
        success: true,
        isCorrect,
        chordData: isCorrect ? chordData : null,
      });
    } catch (error) {
      console.error('Erro ao verificar resposta:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao verificar resposta' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Erro ao processar solicitação:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

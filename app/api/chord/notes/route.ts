import { auth } from '@/lib/auth';
import { decrypt } from '@/lib/encryption';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 },
      );
    }

    const chordToken = (await cookies()).get('chord_token')?.value;

    if (!chordToken) {
      return NextResponse.json(
        { success: false, error: 'Sessão inválida' },
        { status: 400 },
      );
    }

    try {
      const chordData = JSON.parse(decrypt(chordToken));

      if (!chordData || !chordData.note || !chordData.type) {
        return NextResponse.json(
          { success: false, error: 'Dados do acorde inválidos' },
          { status: 400 },
        );
      }

      return NextResponse.json({
        success: true,
        note: chordData.note,
        type: chordData.type,
      });
    } catch (error) {
      console.error('Erro ao obter notas do acorde:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao obter notas do acorde' },
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

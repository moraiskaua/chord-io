import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    console.log(session);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    const userId = user.id;

    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');
    const difficulty = searchParams.get('difficulty');

    if (!dateParam || !difficulty) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 },
      );
    }

    const date = new Date(dateParam);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    const existingAttempt = await db.dailyChord.findFirst({
      where: {
        userId,
        date: {
          gte: date,
          lt: nextDay,
        },
        difficulty: difficulty as string,
      },
    });

    return NextResponse.json({
      hasPlayed: !!existingAttempt,
    });
  } catch (error) {
    console.error('Erro ao verificar status do jogo:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a solicitação' },
      { status: 500 },
    );
  }
}

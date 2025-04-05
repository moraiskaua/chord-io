import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const leaderboardEntrySchema = z.object({
  score: z.number().int().min(0),
  timeTaken: z.number().int().min(0),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 },
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 },
      );
    }

    const userId = user.id;
    const body = await request.json();
    const result = leaderboardEntrySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos' },
        { status: 400 },
      );
    }

    const { score, timeTaken, difficulty } = result.data;

    // Save to GameResult table for leaderboard
    const gameResult = await db.gameResult.create({
      data: {
        userId,
        score,
        timeTaken,
        difficulty,
      },
    });

    return NextResponse.json({
      success: true,
      gameResult,
    });
  } catch (error) {
    console.error('Erro ao salvar resultado para o leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

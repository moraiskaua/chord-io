import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { gameStateSchema } from '@/schemas/game-schemas';
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
    const result = gameStateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos' },
        { status: 400 },
      );
    }

    const { difficulty, attempts, isPlaying, gameOver, score, time } =
      result.data;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingState = await db.gameState.findUnique({
      where: {
        userId_difficulty_date: {
          userId,
          difficulty,
          date: today,
        },
      },
    });

    if (existingState) {
      await db.gameState.update({
        where: {
          userId_difficulty_date: {
            userId,
            difficulty,
            date: today,
          },
        },
        data: {
          attempts,
          isPlaying,
          gameOver,
          score,
          time,
        },
      });
    } else {
      await db.gameState.create({
        data: {
          userId,
          difficulty,
          date: today,
          attempts,
          isPlaying,
          gameOver,
          score,
          time,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar estado do jogo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
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
    const difficulty = request.nextUrl.searchParams.get('difficulty');

    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { success: false, error: 'Dificuldade inválida' },
        { status: 400 },
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const gameState = await db.gameState.findUnique({
      where: {
        userId_difficulty_date: {
          userId,
          difficulty: difficulty as 'easy' | 'medium' | 'hard',
          date: today,
        },
      },
    });

    return NextResponse.json({
      success: true,
      gameState: gameState || null,
    });
  } catch (error) {
    console.error('Erro ao obter estado do jogo:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

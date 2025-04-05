import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { decrypt } from '@/lib/encryption';
import { gameResultSchema } from '@/schemas/game-schemas';
import { revalidatePath } from 'next/cache';
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
    const result = gameResultSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Dados inválidos' },
        { status: 400 },
      );
    }

    const { isCorrect, timeTaken, difficulty } = result.data;
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

      const chordRoot = chordData.note;
      const chordType = chordData.type;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingAttempt = await db.dailyChord.findFirst({
        where: {
          userId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
          difficulty,
        },
      });

      if (existingAttempt) {
        return NextResponse.json(
          {
            success: false,
            error: `Você já jogou o desafio diário no modo ${difficulty} hoje`,
          },
          { status: 400 },
        );
      }

      await db.dailyChord.create({
        data: {
          userId,
          date: today,
          chordRoot,
          chordType,
          isCorrect,
          timeTaken,
          difficulty,
        },
      });

      const userStats = await db.userStats.findUnique({
        where: { userId },
      });

      if (userStats) {
        const lastAttemptDate = userStats.lastAttempt
          ? new Date(userStats.lastAttempt)
          : null;
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const streakContinues =
          lastAttemptDate &&
          lastAttemptDate.getTime() >= yesterday.setHours(0, 0, 0, 0) &&
          lastAttemptDate.getTime() < today.getTime();

        const newStreak = isCorrect
          ? streakContinues
            ? userStats.dailyStreak + 1
            : 1
          : 0;

        const newTotalAttempts = userStats.totalAttempts + 1;
        const newTotalCorrect = userStats.totalCorrect + (isCorrect ? 1 : 0);
        const newAvgTime =
          ((userStats.avgTime || 0) * userStats.totalAttempts + timeTaken) /
          newTotalAttempts;
        const newBestTime =
          userStats.bestDailyTime === null ||
          (isCorrect && timeTaken < userStats.bestDailyTime)
            ? timeTaken
            : userStats.bestDailyTime;

        await db.userStats.update({
          where: { userId },
          data: {
            totalCorrect: newTotalCorrect,
            totalAttempts: newTotalAttempts,
            dailyStreak: newStreak,
            avgTime: newAvgTime,
            bestDailyTime: newBestTime,
            lastAttempt: today,
          },
        });
      } else {
        await db.userStats.create({
          data: {
            userId,
            totalCorrect: isCorrect ? 1 : 0,
            totalAttempts: 1,
            dailyStreak: isCorrect ? 1 : 0,
            avgTime: timeTaken,
            bestDailyTime: isCorrect ? timeTaken : null,
            lastAttempt: today,
          },
        });
      }

      (await cookies()).delete('chord_token');
      revalidatePath('/');
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao processar a solicitação' },
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

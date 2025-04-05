'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { decrypt, encrypt } from '@/lib/encryption';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const chordTypes = {
  easy: ['', 'm'],
  medium: ['', 'm', '7', 'm7', 'maj7'],
  hard: ['dim', 'm7b5', 'aug', '9', 'maj9', 'm9'],
};

type Difficulty = 'easy' | 'medium' | 'hard';

export async function getDailyChord(difficulty: Difficulty) {
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

  const chordId = encrypt(JSON.stringify({ note, type, fullChord }));

  (await cookies()).set('chord_token', chordId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 24 hours
  });

  return { id: chordId };
}

export async function verifyChordAnswer(formData: FormData) {
  const userAnswer = formData.get('answer') as string;
  const chordToken = (await cookies()).get('chord_token')?.value;

  if (!chordToken) {
    return { success: false, error: 'Sessão inválida' };
  }

  try {
    const chordData = JSON.parse(decrypt(chordToken));
    const isCorrect =
      userAnswer.toLowerCase() === chordData.fullChord.toLowerCase();

    return {
      success: true,
      isCorrect,
      chordData: isCorrect ? chordData : null,
    };
  } catch (error) {
    console.error('Erro ao verificar resposta:', error);
    return { success: false, error: 'Erro ao verificar resposta' };
  }
}

export async function getChordNotes() {
  const chordToken = (await cookies()).get('chord_token')?.value;

  if (!chordToken) {
    return { success: false, error: 'Sessão inválida' };
  }

  try {
    const chordData = JSON.parse(decrypt(chordToken));
    return {
      success: true,
      note: chordData.note,
      type: chordData.type,
    };
  } catch (error) {
    console.error('Erro ao obter notas do acorde:', error);
    return { success: false, error: 'Erro ao obter notas do acorde' };
  }
}

export async function saveGameResult(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Não autorizado' };
  }

  const userId = session.user.id;
  const isCorrect = formData.get('isCorrect') === 'true';
  const timeTaken = parseInt(formData.get('timeTaken') as string);
  const difficulty = formData.get('difficulty') as Difficulty;
  const chordToken = (await cookies()).get('chord_token')?.value;

  if (!chordToken || isNaN(timeTaken) || !difficulty) {
    return { success: false, error: 'Dados inválidos' };
  }

  try {
    const chordData = JSON.parse(decrypt(chordToken));
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
      return {
        success: false,
        error: `Você já jogou o desafio diário no modo ${difficulty} hoje`,
      };
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
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
    return { success: false, error: 'Erro ao processar a solicitação' };
  }
}

export async function getGameState(difficulty: Difficulty) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Não autorizado' };
  }

  const userId = session.user.id;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const gameState = await db.gameState.findUnique({
      where: {
        userId_difficulty_date: {
          userId,
          difficulty,
          date: today,
        },
      },
    });

    return {
      success: true,
      gameState: gameState || null,
    };
  } catch (error) {
    console.error('Erro ao obter estado do jogo:', error);
    return { success: false, error: 'Erro ao obter estado do jogo' };
  }
}

export async function saveGameState(formData: FormData) {
  const session = await auth();

  // Add more detailed logging to diagnose the issue
  console.log('Save game state session:', session?.user?.email);

  if (!session?.user?.email) {
    return { success: false, error: 'Não autorizado' };
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return { success: false, error: 'Usuário não encontrado' };
  }

  const userId = user.id;
  const difficulty = formData.get('difficulty') as Difficulty;
  const attempts = parseInt(formData.get('attempts') as string);
  const isPlaying = formData.get('isPlaying') === 'true';
  const gameOver = formData.get('gameOver') === 'true';
  const score = parseInt(formData.get('score') as string);
  const time = parseInt(formData.get('time') as string);

  if (!difficulty || isNaN(attempts) || isNaN(score) || isNaN(time)) {
    return { success: false, error: 'Dados inválidos' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await db.gameState.upsert({
      where: {
        userId_difficulty_date: {
          userId,
          difficulty,
          date: today,
        },
      },
      update: {
        attempts,
        isPlaying,
        gameOver,
        score,
        time,
      },
      create: {
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

    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar estado do jogo:', error);
    return { success: false, error: 'Erro ao salvar estado do jogo' };
  }
}

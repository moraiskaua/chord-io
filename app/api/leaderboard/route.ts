import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { DailyChord } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface FormattedEntry {
  id: string;
  username: string;
  userImage: string | null;
  score: number;
  timeTaken: number;
  difficulty: string;
  createdAt: string;
  totalCorrect: number;
  totalAttempts: number;
  dailyStreak: number;
  avgTime: number;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const difficulty = searchParams.get('difficulty');
    const timeFrame = searchParams.get('timeFrame') || 'all';

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    let dateFilter = {};
    const now = new Date();

    if (timeFrame === 'daily') {
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      dateFilter = {
        createdAt: {
          gte: startOfDay,
        },
      };
    } else if (timeFrame === 'weekly') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      dateFilter = {
        createdAt: {
          gte: startOfWeek,
        },
      };
    } else if (timeFrame === 'yearly') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      dateFilter = {
        createdAt: {
          gte: startOfYear,
        },
      };
    }

    const difficultyFilter = difficulty ? { difficulty } : {};

    const whereClause = {
      ...dateFilter,
      ...difficultyFilter,
    };

    let totalEntries = 0;
    try {
      totalEntries = await db.gameResult.count({
        where: whereClause,
      });
    } catch (countError) {
      console.error('Error counting entries:', countError);
    }

    const totalPages = Math.ceil(totalEntries / pageSize) || 1;
    let entries: any[] = [];

    try {
      entries = await db.gameResult.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              Stats: true,
            },
          },
        },
        orderBy: [{ score: 'desc' }, { timeTaken: 'asc' }],
        skip,
        take: pageSize,
      });
    } catch (queryError) {
      console.error('Error querying entries:', queryError);
    }

    const userIds = entries.map(entry => entry.user.id);

    const dailyChords = await db.dailyChord.findMany({
      where: {
        userId: {
          in: userIds,
        },
        difficulty: difficulty || undefined,
      },
      select: {
        userId: true,
        isCorrect: true,
        difficulty: true,
      },
    });

    const userDailyChords: Record<string, DailyChord[]> = {};
    dailyChords.forEach(chord => {
      if (!userDailyChords[chord.userId]) {
        userDailyChords[chord.userId] = [];
      }
      userDailyChords[chord.userId].push({
        difficulty: chord.difficulty,
        createdAt: new Date(),
        userId: chord.userId,
        timeTaken: 0,
        updatedAt: new Date(),
        date: new Date(),
        chordRoot: '',
        chordType: '',
        isCorrect: chord.isCorrect,
      });
    });

    const formattedEntries: FormattedEntry[] = entries.map(entry => {
      const userChords = userDailyChords[entry.user.id] || [];
      const correctAnswers = userChords.filter(chord => chord.isCorrect).length;
      const totalAttempts = userChords.length;

      return {
        id: entry.id,
        username: entry.user.name || 'Anonymous',
        userImage: entry.user.image || null,
        score: entry.score,
        timeTaken: entry.timeTaken,
        difficulty: entry.difficulty,
        createdAt: entry.createdAt.toISOString(),
        totalCorrect: correctAnswers,
        totalAttempts: totalAttempts,
        dailyStreak: entry.user.Stats?.dailyStreak || 0,
        avgTime: entry.user.Stats?.avgTime || 0,
      };
    });

    return NextResponse.json({
      success: true,
      entries: formattedEntries,
      currentPage: page,
      totalPages,
      totalEntries,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

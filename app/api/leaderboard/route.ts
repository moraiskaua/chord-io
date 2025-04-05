import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

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
    const timeFrame = searchParams.get('timeFrame') || 'daily';

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

    const totalEntries = await db.gameResult.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalEntries / pageSize) || 1;

    const entries = await db.gameResult.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            Stats: true,
          },
        },
      },
      orderBy: [{ score: 'desc' }, { timeTaken: 'asc' }],
      skip,
      take: pageSize,
    });

    const formattedEntries = entries.map(entry => ({
      id: entry.id,
      username: entry.user.name || 'Anonymous',
      score: entry.score,
      timeTaken: entry.timeTaken,
      difficulty: entry.difficulty,
      createdAt: entry.createdAt.toISOString(),
      totalCorrect: entry.user.Stats?.totalCorrect || 0,
      totalAttempts: entry.user.Stats?.totalAttempts || 0,
      dailyStreak: entry.user.Stats?.dailyStreak || 0,
      avgTime: entry.user.Stats?.avgTime || 0,
    }));

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

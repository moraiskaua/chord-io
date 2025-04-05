import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

interface FormattedEntry {
  id: string;
  username: string;
  userImage: string | null;
  score: number;
  timeTaken: number;
  difficulty: string;
  createdAt: string;
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
    let entries: any[] = [];

    if (difficulty === 'all' || !difficulty) {
      try {
        const userScores = await db.gameResult.groupBy({
          by: ['userId'],
          _sum: {
            score: true,
          },
          _min: {
            timeTaken: true,
          },
          where: dateFilter,
        });

        totalEntries = userScores.length;
        const totalPages = Math.ceil(totalEntries / pageSize) || 1;

        const userIds = userScores.map(score => score.userId);
        const paginatedUserIds = userIds.slice(skip, skip + pageSize);

        const userDetails = await db.user.findMany({
          where: {
            id: {
              in: paginatedUserIds,
            },
          },
          select: {
            id: true,
            name: true,
            image: true,
            Stats: true,
          },
        });

        const userTotalScores = await Promise.all(
          paginatedUserIds.map(async userId => {
            const results = await db.gameResult.findMany({
              where: {
                userId,
                ...dateFilter,
              },
              orderBy: [{ timeTaken: 'asc' }],
            });

            const totalScore = results.reduce(
              (sum, result) => sum + result.score,
              0,
            );
            const bestTime = results.length > 0 ? results[0].timeTaken : 0;

            return {
              id: userId,
              userId,
              score: totalScore,
              timeTaken: bestTime,
              createdAt: results.length > 0 ? results[0].createdAt : new Date(),
            };
          }),
        );

        entries = userTotalScores
          .map(result => {
            const userDetail = userDetails.find(u => u.id === result.userId);
            return {
              ...result,
              user: userDetail,
            };
          })
          .sort((a, b) => {
            if (b.score !== a.score) {
              return b.score - a.score;
            }
            return a.timeTaken - b.timeTaken;
          });

        const formattedEntries: FormattedEntry[] = entries.map(entry => {
          return {
            id: entry.id,
            username: entry.user?.name || 'Anonymous',
            userImage: entry.user?.image || null,
            score: entry.score,
            timeTaken: entry.timeTaken,
            difficulty: 'all',
            createdAt: entry.createdAt.toISOString(),
            dailyStreak: entry.user?.Stats?.dailyStreak || 0,
            avgTime: entry.user?.Stats?.avgTime || 0,
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
        console.error('Error processing all difficulties:', error);
      }
    } else {
      try {
        totalEntries = await db.gameResult.count({
          where: whereClause,
        });
      } catch (countError) {
        console.error('Error counting entries:', countError);
      }

      const totalPages = Math.ceil(totalEntries / pageSize) || 1;

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

      const formattedEntries: FormattedEntry[] = entries.map(entry => {
        return {
          id: entry.id,
          username: entry.user.name || 'Anonymous',
          userImage: entry.user.image || null,
          score: entry.score,
          timeTaken: entry.timeTaken,
          difficulty: entry.difficulty,
          createdAt: entry.createdAt.toISOString(),
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
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

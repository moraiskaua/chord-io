'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { LeaderboardTable } from './leaderboard-table';
import { Pagination } from './pagination';

type Difficulty = 'easy' | 'medium' | 'hard' | 'all';
type TimeFrame = 'daily' | 'weekly' | 'yearly' | 'all';

interface LeaderboardEntry {
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

export default function LeaderboardContainer() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/leaderboard', {
        params: {
          page: currentPage,
          difficulty: difficulty === 'all' ? undefined : difficulty,
          timeFrame,
        },
      });

      if (data.success) {
        setEntries(data.entries);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [currentPage, difficulty, timeFrame, fetchLeaderboard]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as Difficulty);
    setCurrentPage(1);
  };

  return (
    <Card className="w-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Melhores Pontuações
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Veja quem está no topo do ranking de reconhecimento de acordes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <Tabs
            defaultValue="all"
            value={timeFrame}
            onValueChange={value => {
              setTimeFrame(value as TimeFrame);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <TabsTrigger
                value="daily"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                Diário
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                Semanal
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                Anual
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm"
              >
                Todos
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="w-full sm:w-48">
            <Select value={difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-12 w-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-12 w-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-12 w-full bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-12 w-full bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : entries.length > 0 ? (
          <>
            <LeaderboardTable entries={entries} />
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Nenhuma pontuação encontrada para esta dificuldade.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setDifficulty('all');
                setTimeFrame('all');
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Ver todas as pontuações
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

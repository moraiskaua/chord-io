import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trophy } from 'lucide-react';

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

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/30';
      case 'hard':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/30';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400 border-slate-200 dark:border-slate-800/30';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Médio';
      case 'hard':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center font-semibold">#</TableHead>
            <TableHead className="font-semibold">Jogador</TableHead>
            <TableHead className="font-semibold">Pontuação</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Acertos
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Streak
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Tempo
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Dificuldade
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow
              key={entry.id}
              className={
                index < 3
                  ? 'bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/20 dark:to-transparent'
                  : ''
              }
            >
              <TableCell className="text-center font-medium">
                {index === 0 ? (
                  <div className="flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                ) : index === 1 ? (
                  <div className="flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-slate-400" />
                  </div>
                ) : index === 2 ? (
                  <div className="flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-amber-700" />
                  </div>
                ) : (
                  <span className="text-slate-600 dark:text-slate-400">
                    {index + 1}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                    <AvatarImage
                      src={entry.userImage || undefined}
                      alt={entry.username}
                    />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 text-xs">
                      {getInitials(entry.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{entry.username}</span>
                </div>
              </TableCell>
              <TableCell className="font-bold text-indigo-600 dark:text-indigo-400">
                {entry.score}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {entry.totalAttempts > 0 ? (
                  <>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {entry.totalCorrect}
                    </span>
                    <span className="text-slate-400 dark:text-slate-600">
                      /
                    </span>
                    <span>{entry.totalAttempts}</span>
                  </>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {entry.dailyStreak > 0 ? (
                  <span className="font-medium">
                    {entry.dailyStreak === 1
                      ? '1 dia'
                      : `${entry.dailyStreak} dias`}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatTime(Math.round(entry.timeTaken))}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  variant="outline"
                  className={`${getDifficultyColor(entry.difficulty)} border`}
                >
                  {getDifficultyLabel(entry.difficulty)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

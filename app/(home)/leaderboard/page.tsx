import { Metadata } from 'next';
import LeaderboardContainer from './_components/leaderboard-container';

export const metadata: Metadata = {
  title: 'Chord.io | Leaderboard',
  description: 'Veja as melhores pontuações dos jogadores de Chord-io',
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <h1 className="text-4xl mb-10 text-center font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
        Ranking
      </h1>

      <LeaderboardContainer />
    </div>
  );
}

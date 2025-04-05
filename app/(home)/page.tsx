import { Suspense } from 'react';
import DailyChordGame from './_components/daily-chord-game';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Chord-io
          </h1>
          <p className="text-muted-foreground">
            Desafie seus ouvidos e reconheça acordes musicais
          </p>
        </header>

        <Suspense fallback={<div>Carregando...</div>}>
          <DailyChordGame />
        </Suspense>
      </div>
    </div>
  );
}

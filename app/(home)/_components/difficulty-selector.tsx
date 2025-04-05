import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DIFFICULTY_ACTIVE_STATES,
  DIFFICULTY_BORDERS,
  DIFFICULTY_COLORS,
  DIFFICULTY_DESCRIPTIONS,
  DIFFICULTY_LABELS,
} from '@/constants/chord-constants';
import { Difficulty } from '@/entities/chord-types';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface DifficultySelectorProps {
  currentMode: Difficulty;
  handleModeChange: (mode: Difficulty) => void;
  isPlaying: boolean;
  loading: boolean;
  alreadyPlayed: Record<Difficulty, boolean>;
  alreadyCorrect: Record<Difficulty, boolean>;
  isPending: boolean;
  startGame: () => Promise<void>;
}

export function DifficultySelector({
  currentMode,
  handleModeChange,
  isPlaying,
  loading,
  alreadyPlayed,
  alreadyCorrect,
  isPending,
  startGame,
}: DifficultySelectorProps) {
  const [localLoading, setLocalLoading] = useState(false);

  const handleStartGame = async () => {
    try {
      setLocalLoading(true);
      await startGame();
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Falha ao iniciar o jogo. Por favor, tente novamente.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Tabs
      defaultValue={currentMode}
      onValueChange={v => handleModeChange(v as Difficulty)}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-8">
        {(['easy', 'medium', 'hard'] as const).map(mode => (
          <TabsTrigger
            key={mode}
            value={mode}
            className={DIFFICULTY_ACTIVE_STATES[mode]}
            disabled={isPlaying}
          >
            {DIFFICULTY_LABELS[mode]}
          </TabsTrigger>
        ))}
      </TabsList>

      {(['easy', 'medium', 'hard'] as const).map(mode => (
        <TabsContent key={mode} value={mode} className="mt-0">
          <Card className={DIFFICULTY_BORDERS[mode]}>
            <CardContent className="pt-6">
              <p className="text-center text-sm text-muted-foreground mb-4">
                {DIFFICULTY_DESCRIPTIONS[mode]}
              </p>

              {alreadyPlayed[mode] && (
                <Alert
                  variant={alreadyCorrect[mode] ? 'default' : 'destructive'}
                  className={`mb-4 border-2 ${
                    alreadyCorrect[mode]
                      ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                  }`}
                >
                  {alreadyCorrect[mode] ? (
                    <CheckCircle2
                      className="size-4 dark:text-green-400"
                      color="#22c55e "
                    />
                  ) : (
                    <AlertCircle className="size-4 text-red-500 dark:text-red-400" />
                  )}
                  <AlertDescription
                    className={
                      alreadyCorrect[mode]
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }
                  >
                    Você já jogou o desafio diário no modo{' '}
                    {DIFFICULTY_LABELS[mode]} hoje
                    {alreadyCorrect[mode] ? ' e acertou!' : ' mas não acertou.'}
                  </AlertDescription>
                </Alert>
              )}

              {!isPlaying && (
                <Button
                  onClick={handleStartGame}
                  className={`w-full ${DIFFICULTY_COLORS[mode]}`}
                  variant="default"
                  style={{
                    background:
                      mode === 'easy'
                        ? 'linear-gradient(to right, #4ade80, #22c55e)'
                        : mode === 'medium'
                        ? 'linear-gradient(to right, #f59e0b, #d97706)'
                        : 'linear-gradient(to right, #ef4444, #dc2626)',
                  }}
                  disabled={
                    loading || localLoading || alreadyPlayed[mode] || isPending
                  }
                >
                  {loading || localLoading
                    ? 'Carregando...'
                    : alreadyPlayed[mode]
                    ? alreadyCorrect[mode]
                      ? 'Acertou hoje!'
                      : 'Já jogado hoje'
                    : 'Iniciar Desafio Diário'}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}

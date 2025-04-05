import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DIFFICULTY_ACTIVE_STATES,
  DIFFICULTY_BORDERS,
  DIFFICULTY_DESCRIPTIONS,
  DIFFICULTY_LABELS,
} from '@/constants/chord-constants';
import { Difficulty } from '@/entities/chord-types';

interface DifficultySelectorProps {
  currentMode: Difficulty;
  handleModeChange: (mode: Difficulty) => void;
  isPlaying: boolean;
  loading: boolean;
  alreadyPlayed: Record<Difficulty, boolean>;
  isPending: boolean;
  startGame: () => Promise<void>;
}

export function DifficultySelector({
  currentMode,
  handleModeChange,
  isPlaying,
  loading,
  alreadyPlayed,
  isPending,
  startGame,
}: DifficultySelectorProps) {
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
              {!isPlaying && (
                <Button
                  onClick={startGame}
                  className={`w-full`}
                  disabled={loading || alreadyPlayed[mode] || isPending}
                >
                  {loading
                    ? 'Carregando...'
                    : alreadyPlayed[mode]
                    ? 'Já jogado hoje'
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

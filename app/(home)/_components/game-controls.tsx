import { Button } from '@/components/ui/button';
import { useTransition } from 'react';

interface GameControlsProps {
  userAnswer: string;
  gameOver: boolean;
  submitting: boolean;
  isArpeggio: boolean;
  setIsArpeggio: (value: boolean) => void;
  playChordSound: () => void;
  checkAnswer: () => Promise<void>;
  setUserAnswer: (value: string) => void;
}

export function GameControls({
  userAnswer,
  gameOver,
  submitting,
  setIsArpeggio,
  playChordSound,
  checkAnswer,
  setUserAnswer,
}: GameControlsProps) {
  const [isPending] = useTransition();

  return (
    <>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="lg"
            className="h-16"
            onClick={() => {
              setIsArpeggio(false);
              playChordSound();
            }}
            disabled={gameOver || submitting || isPending}
          >
            🔊 Ouvir Acorde
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-16"
            onClick={() => {
              setIsArpeggio(true);
              playChordSound();
            }}
            disabled={gameOver || submitting || isPending}
          >
            🎵 Ouvir Arpejo
          </Button>
        </div>
        <Button
          variant="default"
          size="lg"
          className="h-full"
          onClick={checkAnswer}
          disabled={!userAnswer || gameOver || submitting || isPending}
        >
          Confirmar Resposta
        </Button>
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-12 gap-2 w-full max-w-xl">
        {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => (
          <Button
            key={note}
            variant="secondary"
            className="h-12 w-12"
            onClick={() => setUserAnswer(userAnswer + note)}
            disabled={gameOver || submitting || isPending}
          >
            {note}
          </Button>
        ))}
        {['#', 'b', 'm', '7', '9', 'dim'].map(modifier => (
          <Button
            key={modifier}
            variant="secondary"
            className="h-12 w-12"
            onClick={() => setUserAnswer(userAnswer + modifier)}
            disabled={gameOver || submitting || isPending}
          >
            {modifier}
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        className="mt-4"
        onClick={() => setUserAnswer('')}
        disabled={gameOver || submitting || isPending || !userAnswer}
      >
        Limpar
      </Button>
    </>
  );
}

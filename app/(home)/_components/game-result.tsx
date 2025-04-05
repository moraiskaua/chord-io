import { Button } from '@/components/ui/button';

interface GameResultProps {
  isCorrect: boolean | null;
  attempts: number;
  setIsPlaying: (value: boolean) => void;
}

export function GameResult({
  isCorrect,
  attempts,
  setIsPlaying,
}: GameResultProps) {
  return (
    <div className="mt-6 text-center">
      <h3 className="text-xl font-semibold mb-2">
        {isCorrect ? 'Parabéns!' : 'Fim de Jogo'}
      </h3>
      <p className="mb-4">
        {isCorrect
          ? `Você acertou o acorde em ${attempts} tentativa${
              attempts > 1 ? 's' : ''
            }!`
          : 'Você esgotou suas tentativas.'}
      </p>
      <Button variant="outline" onClick={() => setIsPlaying(false)}>
        Voltar ao Menu
      </Button>
    </div>
  );
}

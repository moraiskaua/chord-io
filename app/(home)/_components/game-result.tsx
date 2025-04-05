import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, XCircle } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-8 text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-sm"
    >
      <div className="flex justify-center mb-4">
        {isCorrect ? (
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        ) : (
          <XCircle className="h-16 w-16 text-red-500" />
        )}
      </div>
      <h3 className="text-2xl font-bold mb-3">
        {isCorrect ? 'Parabéns!' : 'Fim de Jogo'}
      </h3>
      <p className="mb-6 text-slate-600 dark:text-slate-300">
        {isCorrect
          ? `Você acertou o acorde em ${attempts} tentativa${
              attempts > 1 ? 's' : ''
            }!`
          : 'Você esgotou suas tentativas.'}
      </p>
      <Button
        variant="outline"
        onClick={() => setIsPlaying(false)}
        className="border-2 px-6 py-5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
      >
        <Home className="mr-2 h-4 w-4" /> Voltar ao Menu
      </Button>
    </motion.div>
  );
}

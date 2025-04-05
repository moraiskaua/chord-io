import { Button } from '@/components/ui/button';
import { Guitar, Music, Piano, Send, Trash2, Volume2 } from 'lucide-react';
import { useTransition } from 'react';

interface GameControlsProps {
  userAnswer: string;
  gameOver: boolean;
  submitting: boolean;
  isArpeggio: boolean;
  setIsArpeggio: (value: boolean) => void;
  playChordSound: (forceArpeggio?: boolean) => void;
  checkAnswer: () => Promise<void>;
  setUserAnswer: (value: string) => void;
  instrument: 'piano' | 'guitar-acoustic';
  toggleInstrument: () => void;
}

export function GameControls({
  userAnswer,
  gameOver,
  submitting,
  setIsArpeggio,
  playChordSound,
  checkAnswer,
  setUserAnswer,
  instrument,
  toggleInstrument,
}: GameControlsProps) {
  const [isPending] = useTransition();
  const isDisabled = gameOver || submitting || isPending;

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 mb-1">
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 ${
                instrument === 'piano'
                  ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
                  : ''
              }`}
              onClick={toggleInstrument}
              disabled={isDisabled || instrument === 'piano'}
            >
              <Piano className="mr-2 h-4 w-4" /> Piano
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 ${
                instrument === 'guitar-acoustic'
                  ? 'bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700'
                  : ''
              }`}
              onClick={toggleInstrument}
              disabled={isDisabled || instrument === 'guitar-acoustic'}
            >
              <Guitar className="mr-2 h-4 w-4" /> Violão
            </Button>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="h-16 border-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 hover:shadow-md transition-all rounded-xl"
            onClick={() => {
              setIsArpeggio(false);
              playChordSound(false);
            }}
            disabled={isDisabled}
          >
            <Volume2 className="mr-2 size-5 text-blue-500" /> Ouvir Acorde
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-16 border-2 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 hover:shadow-md transition-all rounded-xl"
            onClick={() => {
              setIsArpeggio(true);
              playChordSound(true);
            }}
            disabled={isDisabled}
          >
            <Music className="mr-2 size-5 text-purple-500" /> Ouvir Arpejo
          </Button>
        </div>
        <Button
          variant="default"
          size="lg"
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md rounded-xl"
          onClick={checkAnswer}
          disabled={!userAnswer || isDisabled}
        >
          <Send className="mr-2 size-5" />
          {submitting ? 'Verificando...' : 'Confirmar Resposta'}
        </Button>
      </div>

      <div className="w-full max-w-2xl p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border mb-6">
        <div className="mb-5">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
            Notas
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => (
              <Button
                key={note}
                variant="secondary"
                className="h-14 w-14 font-bold text-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg"
                onClick={() => setUserAnswer(userAnswer + note)}
                disabled={isDisabled}
              >
                {note}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
            Acidentes
          </h3>
          <div className="flex gap-2">
            {['#', 'b'].map(modifier => (
              <Button
                key={modifier}
                variant="secondary"
                className="h-14 w-14 font-bold text-lg shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg"
                onClick={() => setUserAnswer(userAnswer + modifier)}
                disabled={isDisabled}
              >
                {modifier}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
            Tipos de Acordes
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {[
              'm',
              '7',
              'm7',
              'maj7',
              '9',
              'm9',
              'dim',
              'aug',
              'sus4',
              'sus2',
              '6',
              'm6',
            ].map(modifier => (
              <Button
                key={modifier}
                variant="secondary"
                className="h-12 font-medium text-sm shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-lg"
                onClick={() => setUserAnswer(userAnswer + modifier)}
                disabled={isDisabled}
              >
                {modifier}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300 transition-all"
        onClick={() => setUserAnswer('')}
        disabled={isDisabled || !userAnswer}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Limpar Resposta
      </Button>
    </div>
  );
}

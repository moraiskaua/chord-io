'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useChordGame } from '@/hooks/use-chord-game';
import { useChordSound } from '@/hooks/use-chord-sound';
import { AnimatePresence, motion } from 'framer-motion';
import { useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { saveGameResult, verifyChordAnswer } from '../_actions/chord-actions';
import { DifficultySelector } from './difficulty-selector';
import { GameControls } from './game-controls';
import { GameResult } from './game-result';

export default function DailyChordGame() {
  const {
    currentMode,
    score,
    time,
    userAnswer,
    isCorrect,
    isPlaying,
    loading,
    attempts,
    gameOver,
    alreadyPlayed,
    submitting,
    MAX_ATTEMPTS,
    setUserAnswer,
    setIsCorrect,
    setSubmitting,
    setAttempts,
    setGameOver,
    setScore,
    setIsPlaying,
    handleModeChange,
    startGame,
    formatTime,
    setAlreadyPlayed,
  } = useChordGame();

  const { isArpeggio, setIsArpeggio, playChordSound } = useChordSound();

  const [isPending, startTransition] = useTransition();

  const checkAnswer = async () => {
    if (!userAnswer) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('answer', userAnswer);

      const result = await verifyChordAnswer(formData);

      if (!result.success) {
        throw new Error(result.error || 'Erro ao verificar resposta');
      }

      setIsCorrect(result.isCorrect ?? null);

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (result.isCorrect) {
        setScore(prev => prev + Math.max(500 - time * 2, 100));
        toast.success(`Correto! O acorde era ${result.chordData.fullChord}`);
        setGameOver(true);
        await saveResult(true);
      } else if (newAttempts >= MAX_ATTEMPTS) {
        toast.error('Você esgotou suas tentativas.');
        setGameOver(true);
        await saveResult(false);
      } else {
        toast.error(`Incorreto. Tentativa ${newAttempts}/${MAX_ATTEMPTS}`);
        setUserAnswer('');
      }

      setSubmitting(false);
    } catch (error: any) {
      console.error('Erro ao verificar resposta:', error);
      toast.error(error.message || 'Erro ao verificar resposta');
      setSubmitting(false);
    }
  };

  const saveResult = async (isCorrect: boolean) => {
    try {
      const formData = new FormData();
      formData.append('isCorrect', isCorrect.toString());
      formData.append('timeTaken', time.toString());
      formData.append('difficulty', currentMode);

      startTransition(async () => {
        const result = await saveGameResult(formData);

        if (!result.success) {
          throw new Error(result.error || 'Erro ao salvar resultado');
        }

        setAlreadyPlayed(prev => ({
          ...prev,
          [currentMode]: true,
        }));
      });
    } catch (error: any) {
      console.error('Erro ao salvar resultado:', error);
      toast.error(error.message || 'Erro ao salvar resultado');
    }
  };

  return (
    <>
      <div className="flex justify-center items-center gap-4 mb-4">
        <Badge variant="outline" className="px-4 py-1 text-sm">
          🏆 {score}
        </Badge>
        <Badge variant="outline" className="px-4 py-1 text-sm">
          ⏱️ {formatTime(time)}
        </Badge>
        {isPlaying && (
          <Badge variant="outline" className="px-4 py-1 text-sm">
            🎯 {attempts}/{MAX_ATTEMPTS}
          </Badge>
        )}
      </div>

      <DifficultySelector
        currentMode={currentMode}
        handleModeChange={handleModeChange}
        isPlaying={isPlaying}
        loading={loading}
        alreadyPlayed={alreadyPlayed}
        isPending={isPending}
        startGame={startGame}
      />

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <Card className="border shadow-md">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-full mb-4">
                  <Progress
                    value={(attempts / MAX_ATTEMPTS) * 100}
                    className="h-2"
                  />
                </div>

                <div className="text-4xl font-mono font-bold mb-8">
                  {userAnswer || '?'}
                </div>

                <GameControls
                  userAnswer={userAnswer}
                  gameOver={gameOver}
                  submitting={submitting}
                  isArpeggio={isArpeggio}
                  setIsArpeggio={setIsArpeggio}
                  playChordSound={playChordSound}
                  checkAnswer={checkAnswer}
                  setUserAnswer={setUserAnswer}
                />

                {gameOver && (
                  <GameResult
                    isCorrect={isCorrect}
                    attempts={attempts}
                    setIsPlaying={setIsPlaying}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

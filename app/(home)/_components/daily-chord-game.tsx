'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useChordGame } from '@/hooks/use-chord-game';
import { useChordSound } from '@/hooks/use-chord-sound';
import {
  AnswerFormData,
  answerSchema,
  GameResultFormData,
  gameResultSchema,
} from '@/schemas/game-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
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
    loadGameState,
    saveGameState,
    stopTimer,
  } = useChordGame();

  const {
    isArpeggio,
    instrument,
    setIsArpeggio,
    playChordSound,
    toggleInstrument,
  } = useChordSound();
  const [isPending, startTransition] = useTransition();
  const [alreadyCorrect, setAlreadyCorrect] = useState<Record<string, boolean>>(
    {
      easy: false,
      medium: false,
      hard: false,
    },
  );

  const loadPreviousResults = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/user/previous-results');
      if (data.success && data.results) {
        const correctMap: Record<string, boolean> = {
          easy: false,
          medium: false,
          hard: false,
        };

        data.results.forEach((result: any) => {
          if (result.difficulty && result.isCorrect !== undefined) {
            correctMap[result.difficulty] = result.isCorrect;
          }
        });

        setAlreadyCorrect(correctMap);
      }
    } catch (error) {
      console.error('Error loading previous results:', error);
    }
  }, []);

  useEffect(() => {
    loadGameState();
    loadPreviousResults();
  }, []);

  useEffect(() => {
    if (alreadyPlayed[currentMode] && isPlaying) {
      setIsPlaying(false);
      setGameOver(false);
      stopTimer();
    }
  }, [
    alreadyPlayed,
    currentMode,
    isPlaying,
    setIsPlaying,
    setGameOver,
    stopTimer,
  ]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const saveInterval = setInterval(() => {
        saveGameState({
          difficulty: currentMode,
          attempts,
          isPlaying,
          gameOver,
          score,
          time,
        });
      }, 15000);

      return () => clearInterval(saveInterval);
    }
  }, [isPlaying, gameOver, attempts, score, time, currentMode, saveGameState]);

  const answerForm = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: '',
    },
  });

  const resultForm = useForm<GameResultFormData>({
    resolver: zodResolver(gameResultSchema),
    defaultValues: {
      isCorrect: false,
      timeTaken: 0,
      difficulty: currentMode,
    },
  });

  const checkAnswer = async () => {
    if (!userAnswer) return;

    try {
      setSubmitting(true);

      const { data: result } = await axios.post('/api/game/verify', {
        answer: userAnswer,
      });

      if (!result.success) {
        throw new Error(result.error || 'Erro ao verificar resposta');
      }

      setIsCorrect(result.isCorrect ?? null);

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      await saveGameState({
        difficulty: currentMode,
        attempts: newAttempts,
        isPlaying,
        gameOver,
        score,
        time,
      });

      if (result.isCorrect) {
        const newScore = score + Math.max(500 - time * 2, 100);
        setScore(newScore);
        toast.success(`Correto! O acorde era ${result.chordData.fullChord}`);
        setGameOver(true);

        resultForm.setValue('isCorrect', true);
        resultForm.setValue('timeTaken', time);
        resultForm.setValue('difficulty', currentMode);

        await saveGameState({
          difficulty: currentMode,
          attempts: newAttempts,
          isPlaying: false,
          gameOver: true,
          score: newScore,
          time,
        });

        await saveResult(true);
      } else if (newAttempts >= MAX_ATTEMPTS) {
        toast.error('Você esgotou suas tentativas.');
        setGameOver(true);

        resultForm.setValue('isCorrect', false);
        resultForm.setValue('timeTaken', time);
        resultForm.setValue('difficulty', currentMode);

        await saveGameState({
          difficulty: currentMode,
          attempts: newAttempts,
          isPlaying: false,
          gameOver: true,
          score,
          time,
        });

        await saveResult(false);
      } else {
        toast.error(`Incorreto. Tentativa ${newAttempts}/${MAX_ATTEMPTS}`);
        setUserAnswer('');
        answerForm.reset();
      }

      setSubmitting(false);
    } catch (error: any) {
      console.error('Erro ao verificar resposta:', error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          'Erro ao verificar resposta',
      );
      setSubmitting(false);
    }
  };

  const saveResult = async (isCorrect: boolean) => {
    try {
      startTransition(async () => {
        const { data: result } = await axios.post('/api/game/save-result', {
          isCorrect,
          timeTaken: time,
          difficulty: currentMode,
        });

        if (!result.success) {
          throw new Error(result.error || 'Erro ao salvar resultado');
        }

        setAlreadyPlayed(prev => ({
          ...prev,
          [currentMode]: true,
        }));

        setAlreadyCorrect(prev => ({
          ...prev,
          [currentMode]: isCorrect,
        }));
      });
    } catch (error: any) {
      console.error('Erro ao salvar resultado:', error);
      toast.error(
        error.response?.data?.error ||
          error.message ||
          'Erro ao salvar resultado',
      );
    }
  };

  return (
    <>
      <div className="flex justify-center items-center gap-4 mb-6">
        <Badge
          variant="outline"
          className="px-4 py-2 text-base shadow-sm border-2"
        >
          🏆 {score}
        </Badge>
        <Badge
          variant="outline"
          className="px-4 py-2 text-base shadow-sm border-2"
        >
          ⏱️ {formatTime(time)}
        </Badge>
        {isPlaying && (
          <Badge
            variant="outline"
            className="px-4 py-2 text-base shadow-sm border-2"
          >
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
        alreadyCorrect={alreadyCorrect}
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
            className="mt-8"
          >
            <Card className="border-2 shadow-lg rounded-xl overflow-hidden">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="w-full mb-6">
                  <Progress
                    value={(attempts / MAX_ATTEMPTS) * 100}
                    className="h-3 rounded-full"
                  />
                </div>

                <div className="text-5xl font-mono font-bold mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-inner">
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
                  instrument={instrument}
                  toggleInstrument={toggleInstrument}
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

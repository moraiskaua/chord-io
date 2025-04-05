import {
  getDailyChord,
  getGameState,
  saveGameState,
} from '@/app/(home)/_actions/chord-actions';
import { MAX_ATTEMPTS } from '@/constants/chord-constants';
import { Difficulty } from '@/entities/chord-types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export function useChordGame() {
  const { data: session } = useSession();
  const [currentMode, setCurrentMode] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState<
    Record<Difficulty, boolean>
  >({
    easy: false,
    medium: false,
    hard: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && !gameOver) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (session?.user) {
      checkIfAlreadyPlayed();
    }
  }, [session, currentMode]);

  useEffect(() => {
    if (session?.user && isPlaying) {
      const saveState = async () => {
        const formData = new FormData();
        formData.append('difficulty', currentMode);
        formData.append('attempts', attempts.toString());
        formData.append('isPlaying', isPlaying.toString());
        formData.append('gameOver', gameOver.toString());
        formData.append('score', score.toString());
        formData.append('time', time.toString());

        await saveGameState(formData);
      };

      const timeoutId = setTimeout(() => {
        saveState();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [session, currentMode, attempts, isPlaying, gameOver, score, time]);

  const checkIfAlreadyPlayed = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const response = await fetch(
        `/api/user/daily-status?date=${today.toISOString()}&difficulty=${currentMode}`,
      );
      const data = await response.json();

      setAlreadyPlayed(prev => ({
        ...prev,
        [currentMode]: data.hasPlayed,
      }));

      if (data.hasPlayed) {
        toast.success(
          `Você já jogou o desafio diário no modo ${currentMode} hoje!`,
        );
        setLoading(false);
        return;
      }

      const gameStateResult = await getGameState(currentMode);

      if (gameStateResult.success && gameStateResult.gameState) {
        const state = gameStateResult.gameState;
        setAttempts(state.attempts);
        setIsPlaying(state.isPlaying);
        setGameOver(state.gameOver);
        setScore(state.score);
        setTime(state.time);

        if (state.isPlaying) {
          toast.success('Continuando jogo em andamento...');
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar status do jogo:', error);
      setLoading(false);
    }
  };

  const handleModeChange = (mode: Difficulty) => {
    setCurrentMode(mode);
    setScore(0);
    setTime(0);
    setUserAnswer('');
    setIsCorrect(null);
    setIsPlaying(false);
    setAttempts(0);
    setGameOver(false);
  };

  const startGame = async () => {
    if (alreadyPlayed[currentMode]) {
      toast.error(
        `Você já jogou o desafio diário no modo ${currentMode} hoje!`,
      );
      return;
    }

    try {
      setLoading(true);
      await getDailyChord(currentMode);
      setIsPlaying(true);
      setUserAnswer('');
      setIsCorrect(null);
      setAttempts(0);
      setGameOver(false);
      setScore(0);
      setTime(0);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error);
      toast.error('Falha ao iniciar o jogo. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return {
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
  };
}

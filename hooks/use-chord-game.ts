import { MAX_ATTEMPTS } from '@/constants/chord-constants';
import { Difficulty } from '@/entities/chord-types';
import { GameStateFormData, gameStateSchema } from '@/schemas/game-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type GameState = {
  difficulty: Difficulty;
  attempts: number;
  isPlaying: boolean;
  gameOver: boolean;
  score: number;
  time: number;
};

export function useChordGame() {
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
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  const { handleSubmit, setValue, reset } = useForm<GameStateFormData>({
    resolver: zodResolver(gameStateSchema),
    defaultValues: {
      difficulty: currentMode,
      attempts: 0,
      isPlaying: false,
      gameOver: false,
      score: 0,
      time: 0,
    },
  });

  const resetGameState = (mode: Difficulty) => {
    setScore(0);
    setTime(0);
    setUserAnswer('');
    setIsCorrect(null);
    setIsPlaying(false);
    setAttempts(0);
    setGameOver(false);

    reset({
      difficulty: mode,
      attempts: 0,
      isPlaying: false,
      gameOver: false,
      score: 0,
      time: 0,
    });
  };

  const updateGameState = (state: GameState) => {
    setAttempts(state.attempts);
    setIsPlaying(state.isPlaying);
    setGameOver(state.gameOver);
    setScore(state.score);
    setTime(state.time);

    setValue('attempts', state.attempts);
    setValue('isPlaying', state.isPlaying);
    setValue('gameOver', state.gameOver);
    setValue('score', state.score);
    setValue('time', state.time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const startTimer = () => {
    stopTimer();
    const interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const fetchDailyStatus = async (difficulty: Difficulty) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data } = await axios.get('/api/user/daily-status', {
      params: {
        date: today.toISOString(),
        difficulty,
      },
    });
    return data.hasPlayed;
  };

  const fetchAllDailyStatuses = async () => {
    const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
    const results = await Promise.all(
      difficulties.map(difficulty => fetchDailyStatus(difficulty)),
    );

    return {
      easy: results[0],
      medium: results[1],
      hard: results[2],
    };
  };

  const saveGameState = async (params: GameState) => {
    try {
      const { data } = await axios.post('/api/game/state', params);
      return data;
    } catch (error) {
      console.error('Erro ao salvar estado do jogo:', error);
      throw new Error('Erro ao salvar estado do jogo');
    }
  };

  const verifyAnswer = async (answer: string) => {
    try {
      const { data } = await axios.post('/api/game/verify', { answer });
      return data;
    } catch (error) {
      console.error('Erro ao verificar resposta:', error);
      throw new Error('Erro ao verificar resposta');
    }
  };

  const saveResult = async (
    isCorrect: boolean,
    timeTaken: number,
    difficulty: Difficulty,
  ) => {
    try {
      if (gameOver) {
        stopTimer();
      }

      const { data } = await axios.post('/api/game/save-result', {
        isCorrect,
        timeTaken,
        difficulty,
      });

      return data;
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      throw new Error('Erro ao salvar resultado');
    }
  };

  const handleModeChange = (mode: Difficulty) => {
    stopTimer();
    setCurrentMode(mode);
    resetGameState(mode);
    checkIfAlreadyPlayed();
  };

  const checkIfAlreadyPlayed = async () => {
    try {
      setLoading(true);
      const hasPlayed = await fetchDailyStatus(currentMode);

      setAlreadyPlayed(prev => ({
        ...prev,
        [currentMode]: hasPlayed,
      }));

      setLoading(false);
      return hasPlayed;
    } catch (error) {
      console.error('Erro ao verificar status do jogo:', error);
      setLoading(false);
      return false;
    }
  };

  const loadGameState = async () => {
    try {
      setLoading(true);

      const newAlreadyPlayed = await fetchAllDailyStatuses();
      setAlreadyPlayed(newAlreadyPlayed);

      if (!newAlreadyPlayed[currentMode]) {
        const { data: gameStateData } = await axios.get('/api/game/state', {
          params: { difficulty: currentMode },
        });

        if (gameStateData.success && gameStateData.gameState) {
          const state = gameStateData.gameState;

          if (!state.gameOver) {
            updateGameState(state);

            if (state.isPlaying) {
              toast.success('Continuando jogo em andamento...');
              startTimer();
            }
          } else {
            setIsPlaying(false);
          }
        }
      } else {
        setIsPlaying(false);
        setGameOver(false);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao verificar status do jogo:', error);
      setLoading(false);
    }
  };

  const startGame = async () => {
    try {
      setLoading(true);

      const hasPlayed = await fetchDailyStatus(currentMode);

      if (hasPlayed) {
        setAlreadyPlayed(prev => ({
          ...prev,
          [currentMode]: true,
        }));
        setLoading(false);
        return;
      }

      await axios.post('/api/game/start', { difficulty: currentMode });

      resetGameState(currentMode);
      setIsPlaying(true);
      startTimer();

      await saveGameState({
        difficulty: currentMode,
        attempts: 0,
        isPlaying: true,
        gameOver: false,
        score: 0,
        time: 0,
      });

      setLoading(false);
    } catch (error) {
      console.error('Erro ao iniciar jogo:', error);
      toast.error('Falha ao iniciar o jogo. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

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
    handleSubmit,
    verifyAnswer,
    saveResult,
    loadGameState,
    startTimer,
    stopTimer,
    saveGameState,
  };
}

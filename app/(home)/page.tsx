'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type ChordData = {
  note: string;
  type: string;
  fullChord: string;
};

export default function Home() {
  const [currentMode, setCurrentMode] = useState<'easy' | 'medium' | 'hard'>(
    'easy',
  );
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChord, setCurrentChord] = useState<ChordData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleModeChange = (mode: 'easy' | 'medium' | 'hard') => {
    setCurrentMode(mode);
    setScore(0);
    setTime(0);
    setUserAnswer('');
    setIsCorrect(null);
    setIsPlaying(false);
    setCurrentChord(null);
  };

  const fetchChord = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/daily-chord?difficulty=${currentMode}&mode=daily`,
      );
      if (!response.ok) throw new Error('Failed to fetch chord');
      const data = await response.json();
      setCurrentChord(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chord:', error);
      toast.error('Failed to fetch chord. Please try again.');
      setLoading(false);
    }
  };

  const startGame = async () => {
    await fetchChord();
    setIsPlaying(true);
    setUserAnswer('');
    setIsCorrect(null);
  };

  const playChordSound = () => {
    toast.success('Playing Sound');
  };

  const checkAnswer = () => {
    if (!currentChord) return;

    const isAnswerCorrect =
      userAnswer.toLowerCase() === currentChord.fullChord.toLowerCase();
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore(prev => prev + 100);
      toast.success(`That's right! The chord was ${currentChord.fullChord}`);
    } else {
      toast.error(`The correct answer was ${currentChord.fullChord}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Chord-io
          </h1>

          <div className="flex justify-center items-center gap-4">
            <Badge variant="outline" className="px-4 py-1 text-sm">
              🏆 {score}
            </Badge>
            <Badge variant="outline" className="px-4 py-1 text-sm">
              ⏱️ {formatTime(time)}
            </Badge>
          </div>
        </header>

        <Tabs
          defaultValue={currentMode}
          onValueChange={v => handleModeChange(v as any)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger
              value="easy"
              className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
            >
              Fácil
            </TabsTrigger>
            <TabsTrigger
              value="medium"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
            >
              Médio
            </TabsTrigger>
            <TabsTrigger
              value="hard"
              className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800"
            >
              Difícil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="easy" className="mt-0">
            <Card className="border-green-200">
              <CardContent className="pt-6">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Reconheça acordes maiores e menores básicos
                </p>
                {!isPlaying && (
                  <Button
                    onClick={startGame}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : 'Iniciar'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medium" className="mt-0">
            <Card className="border-amber-200">
              <CardContent className="pt-6">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Reconheça acordes com 7ª e 9ª
                </p>
                {!isPlaying && (
                  <Button
                    onClick={startGame}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : 'Iniciar'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hard" className="mt-0">
            <Card className="border-rose-200">
              <CardContent className="pt-6">
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Reconheça acordes diminutos e meio-diminutos
                </p>
                {!isPlaying && (
                  <Button
                    onClick={startGame}
                    className="w-full bg-rose-600 hover:bg-rose-700"
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : 'Iniciar'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isPlaying && (
          <Card className="border shadow-md">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="text-4xl font-mono font-bold mb-8">
                {userAnswer || '?'}
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16"
                  onClick={playChordSound}
                >
                  🔊 Ouvir
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  className="h-16"
                  onClick={checkAnswer}
                  disabled={!userAnswer}
                >
                  Confirmar
                </Button>
              </div>

              <div className="grid grid-cols-7 sm:grid-cols-12 gap-2 w-full max-w-xl">
                {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => (
                  <Button
                    key={note}
                    variant="secondary"
                    className="h-12 w-12"
                    onClick={() => setUserAnswer(prev => prev + note)}
                  >
                    {note}
                  </Button>
                ))}
                {['#', 'b', 'm', '7', '9', 'dim'].map(modifier => (
                  <Button
                    key={modifier}
                    variant="secondary"
                    className="h-12 w-12"
                    onClick={() => setUserAnswer(prev => prev + modifier)}
                  >
                    {modifier}
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => setUserAnswer('')}
              >
                Limpar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

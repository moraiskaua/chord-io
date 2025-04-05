import { z } from 'zod';

export const gameStateSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard'] as const),
  attempts: z.number().int().min(0),
  isPlaying: z.boolean(),
  gameOver: z.boolean(),
  score: z.number().int().min(0),
  time: z.number().int().min(0),
});

export const answerSchema = z.object({
  answer: z.string().min(1),
});

export const difficultySchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard'] as const),
});

export const gameResultSchema = z.object({
  isCorrect: z.boolean(),
  timeTaken: z.number().int().min(0),
  difficulty: z.enum(['easy', 'medium', 'hard'] as const),
});

export type GameStateFormData = z.infer<typeof gameStateSchema>;
export type AnswerFormData = z.infer<typeof answerSchema>;
export type DifficultyFormData = z.infer<typeof difficultySchema>;
export type GameResultFormData = z.infer<typeof gameResultSchema>;

import { AuthError, CredentialsSignin } from 'next-auth';
import { signIn } from '@/lib/auth';
import { z } from 'zod';
import { ROUTES } from '@/constants/routes';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const useSignInController = () => {
  const signInAction = async (formData: FormData) => {
    'use server';
    const { success, data } = signInSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!success) {
      return;
    }

    const { email, password } = data;

    try {
      await signIn('credentials', {
        email,
        password,
        redirectTo: ROUTES.WELCOME,
      });
    } catch (error) {
      if (error instanceof CredentialsSignin) {
        return { error: 'Credenciais inválidas' };
      }

      if (error instanceof AuthError) {
        return { error: 'Algo deu errado. Tente novamente mais tarde.' };
      }
    }
  };

  return { signInAction };
};

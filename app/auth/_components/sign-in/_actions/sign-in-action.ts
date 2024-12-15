'use server';

import { signIn } from '@/lib/auth';
import { signInSchema } from '../_schemas/sign-in-schema';
import { ROUTES } from '@/constants/routes';
import { AuthError, CredentialsSignin } from 'next-auth';

export const signInAction = async (formData: FormData) => {
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

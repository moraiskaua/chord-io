'use server';

import { signUpSchema } from '../_schemas/sign-up-schema';
import { hash } from 'bcryptjs';
import { db } from '@/lib/db';

export const signUpAction = async (formData: FormData) => {
  const { success, data } = signUpSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!success) {
    return;
  }

  const { name, email, password } = data;
  const hashedPassword = await hash(password, 12);

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch {
    return { error: 'Algo deu errado. Tente novamente mais tarde.' };
  }
};

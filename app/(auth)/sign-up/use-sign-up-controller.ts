import { hash } from 'bcryptjs';
import { db } from '@/lib/db';
import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const useSignUpController = () => {
  const signUpAction = async (formData: FormData) => {
    'use server';
    const { success, data } = signUpSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!success) {
      return;
    }

    const { name, email, password } = data;
    const hashedPassword = await hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  };

  return { signUpAction };
};

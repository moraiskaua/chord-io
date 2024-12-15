import { signInSchema } from '@/app/(auth)/sign-in/_schemas/sign-in-schema';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import { db } from './db';
import { NextResponse } from 'next/server';
import { ROUTES } from '@/constants/routes';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      authorize: async credentials => {
        const { success, data } = signInSchema.safeParse(credentials);

        if (!success) {
          return null;
        }

        const { email, password } = data;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValidPassword = await compare(password, user.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          image: user.image,
          name: user.name,
          email: user.email,
        };
      },
    }),
    Google,
    Discord,
  ],
  pages: {
    signIn: '/sign-in',
  },
});

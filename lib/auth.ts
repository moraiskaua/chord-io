import { signInSchema } from '@/app/auth/_components/sign-in/_schemas/sign-in-schema';
import { ROUTES } from '@/constants/routes';
import { User } from '@/entities/user';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import { db } from './db';

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

        const accounts = await db.account.findMany({
          where: { userId: user.id },
        });

        return {
          id: user.id,
          image: user.image,
          name: user.name,
          email: user.email,
          accounts,
        };
      },
    }),
    Google,
    Discord,
  ],
  pages: {
    signIn: ROUTES.AUTH,
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.accounts) {
        session.user.accounts = token.accounts;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accounts = (user as User).accounts;
      }

      return token;
    },
  },
});

import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { ButtonHTMLAttributes } from 'react';
import { ROUTES } from '@/constants/routes';

interface SignInWithGoogleProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignInWithGoogle = (props: SignInWithGoogleProps) => {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google', { redirectTo: ROUTES.WELCOME });
      }}
    >
      <Button variant="destructive" type="submit" className="w-full" {...props}>
        <FaGoogle />
        Entrar com Google
      </Button>
    </form>
  );
};

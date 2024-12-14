import { signIn } from '@/auth';
import { Button } from '../ui/button';
import { FaGoogle } from 'react-icons/fa';
import { ButtonHTMLAttributes } from 'react';

interface SignInWithGoogleProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignInWithGoogle = (props: SignInWithGoogleProps) => {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <Button variant='destructive' type='submit' className='w-full' {...props}>
        <FaGoogle />
        Entrar com Google
      </Button>
    </form>
  );
};

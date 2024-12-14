import { signIn } from '@/auth';
import { Button } from '../ui/button';
import { FaDiscord } from 'react-icons/fa';
import { ButtonHTMLAttributes } from 'react';

interface SignInWithDiscordProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignInWithDiscord = (props: SignInWithDiscordProps) => {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('discord');
      }}
    >
      <Button
        type='submit'
        className='bg-[#7289da] hover:bg-[#7289da]/80 w-full'
        {...props}
      >
        <FaDiscord />
        Entrar com Discord
      </Button>
    </form>
  );
};

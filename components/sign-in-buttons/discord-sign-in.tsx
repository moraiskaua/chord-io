import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { FaDiscord } from 'react-icons/fa';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ROUTES } from '@/constants/routes';

interface SignInWithDiscordProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const SignInWithDiscord = ({
  children,
  ...props
}: SignInWithDiscordProps) => {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('discord', { redirectTo: ROUTES.HOME });
      }}
    >
      <Button
        type="submit"
        className="bg-[#7289da] hover:bg-[#7289da]/80 w-full"
        {...props}
      >
        <FaDiscord />
        {children}
      </Button>
    </form>
  );
};

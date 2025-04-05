import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { signIn } from '@/lib/auth';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { FaDiscord } from 'react-icons/fa';

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

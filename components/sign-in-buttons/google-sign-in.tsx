import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { ROUTES } from '@/constants/routes';

interface SignInWithGoogleProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const SignInWithGoogle = ({
  children,
  ...props
}: SignInWithGoogleProps) => {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google', { redirectTo: ROUTES.HOME });
      }}
    >
      <Button variant="destructive" type="submit" className="w-full" {...props}>
        <FaGoogle />
        {children}
      </Button>
    </form>
  );
};

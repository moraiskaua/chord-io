import { Button } from '@/components/ui/button';
import { signOutAction } from '../_actions/sign-out-action';
import { ReactNode } from 'react';

interface SignOutButtonProps {
  children: ReactNode;
}
export const SignOutButton = ({ children }: SignOutButtonProps) => {
  return <Button onClick={signOutAction}>{children}</Button>;
};

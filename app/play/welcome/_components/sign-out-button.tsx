'use client';

import { Button } from '@/components/ui/button';
import { signOutAction } from '../_actions/sign-out-action';

export const SignOutButton = () => {
  return <Button onClick={signOutAction}>Sair</Button>;
};

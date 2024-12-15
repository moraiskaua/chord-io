'use client';

import { useSignInFormController } from '../_controllers/use-sign-in-form-controller';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';

export const SignInForm = () => {
  const { isPending, dispatchAction } = useSignInFormController();

  return (
    <form action={dispatchAction} className="space-y-3">
      <Input name="email" type="email" placeholder="E-mail" required />
      <Input name="password" type="password" placeholder="Senha" required />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2Icon className="animate-spin" /> : 'Entrar'}
      </Button>
    </form>
  );
};

'use client';

import { useSignInFormController } from './use-sign-in-form-controller';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2Icon } from 'lucide-react';

interface SignInFormProps {
  signInAction: (formData: FormData) => Promise<
    | {
        error: string;
      }
    | undefined
  >;
}

export const SignInForm = ({ signInAction }: SignInFormProps) => {
  const { isPending, dispatchAction } = useSignInFormController({
    signInAction,
  });

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

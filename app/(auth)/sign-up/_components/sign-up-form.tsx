'use client';

import { useSignUpFormController } from '../_controllers/use-sign-up-form-controller';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';

export const SignUpForm = () => {
  const { isPending, dispatchAction } = useSignUpFormController();

  return (
    <form action={dispatchAction} className="space-y-3">
      <Input name="name" type="text" placeholder="Nome" required />
      <Input name="email" type="email" placeholder="E-mail" required />
      <Input name="password" type="password" placeholder="Senha" required />
      <div className="text-center">
        <Button type="submit" className="w-full mb-2">
          {isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            ' Criar conta'
          )}
        </Button>
        Já possui uma conta?{' '}
        <Link href={ROUTES.SIGN_IN} className="underline">
          Entrar
        </Link>
      </div>
    </form>
  );
};

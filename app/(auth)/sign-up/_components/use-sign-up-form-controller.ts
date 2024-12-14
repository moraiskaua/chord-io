import { signUpAction } from '../_actions/sign-up-action';
import { ROUTES } from '@/constants/routes';
import { redirect } from 'next/navigation';
import { useActionState } from 'react';
import toast from 'react-hot-toast';

export const useSignUpFormController = () => {
  const [, dispatchAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const response = await signUpAction(formData);

      if (response?.error) {
        return toast.error(response.error);
      }

      toast.success('Conta criada com sucesso!');
      return redirect(ROUTES.SIGN_IN);
    },
    null,
  );

  return { isPending, dispatchAction };
};

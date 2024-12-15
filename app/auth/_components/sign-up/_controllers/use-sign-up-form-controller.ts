import { signUpAction } from '../_actions/sign-up-action';
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
    },
    null,
  );

  return { isPending, dispatchAction };
};

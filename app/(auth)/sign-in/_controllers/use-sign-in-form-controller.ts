import { signInAction } from '../_actions/sign-in-action';
import { useActionState } from 'react';
import toast from 'react-hot-toast';

export const useSignInFormController = () => {
  const [, dispatchAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const response = await signInAction(formData);

      if (response?.error) {
        toast.error(response.error);
      }
    },
    null,
  );

  return { isPending, dispatchAction };
};

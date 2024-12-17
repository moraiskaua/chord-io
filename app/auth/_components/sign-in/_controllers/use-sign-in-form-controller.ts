import { ROUTES } from '@/constants/routes';
import { signInAction } from '../_actions/sign-in-action';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import toast from 'react-hot-toast';

export const useSignInFormController = () => {
  const router = useRouter();
  const [, dispatchAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const response = await signInAction(formData);

      if (response?.error) {
        return toast.error(response.error);
      }

      return router.push(ROUTES.HOME);
    },
    null,
  );

  return { isPending, dispatchAction };
};

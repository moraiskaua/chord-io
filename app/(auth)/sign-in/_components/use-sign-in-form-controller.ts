import { useActionState } from 'react';
import toast from 'react-hot-toast';

interface SignInFormControllerProps {
  signInAction: (formData: FormData) => Promise<
    | {
        error: string;
      }
    | undefined
  >;
}

export const useSignInFormController = ({
  signInAction,
}: SignInFormControllerProps) => {
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

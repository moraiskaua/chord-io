import { SignInWithDiscord } from '@/components/sign-in-buttons/discord-sign-in';
import { SignInWithGoogle } from '@/components/sign-in-buttons/google-sign-in';
import { useSignInController } from './use-sign-in-controller';
import { SignInForm } from './components/sign-in-form';

const SignInPage = () => {
  const { signInAction } = useSignInController();

  return (
    <main className="h-screen">
      <section className="h-full container mx-auto">
        <div className="h-full w-1/2 mx-auto flex flex-col justify-center gap-3">
          <h1 className="text-3xl font-bold">
            Entre para salvar seu progresso.
          </h1>

          <SignInForm signInAction={signInAction} />
          <SignInWithGoogle />
          <SignInWithDiscord />
        </div>
      </section>
    </main>
  );
};

export default SignInPage;

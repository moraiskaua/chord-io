import { SignInWithDiscord } from '@/components/sign-in-buttons/discord-sign-in';
import { SignInWithGoogle } from '@/components/sign-in-buttons/google-sign-in';
import { SignInForm } from './_components/sign-in-form';

const SignInPage = () => {
  return (
    <div className="h-full w-full space-y-3">
      <h1 className="text-3xl font-bold">Entre para salvar seu progresso.</h1>
      <SignInForm />
      <SignInWithGoogle>Entrar com Google</SignInWithGoogle>
      <SignInWithDiscord disabled className="hover:cursor-not-allowed">
        Entrar com Discord
      </SignInWithDiscord>
    </div>
  );
};

export default SignInPage;

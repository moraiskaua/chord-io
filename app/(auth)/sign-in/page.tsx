import { SignInWithDiscord } from '@/components/sign-in-buttons/discord-sign-in';
import { SignInWithGoogle } from '@/components/sign-in-buttons/google-sign-in';
import { SignInForm } from './_components/sign-in-form';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

const SignInPage = () => {
  return (
    <main className="h-screen">
      <section className="h-full container mx-auto">
        <div className="h-full w-1/2 mx-auto flex flex-col justify-center gap-3">
          <h1 className="text-3xl font-bold">
            Entre para salvar seu progresso.
          </h1>

          <SignInForm />
          <SignInWithGoogle />
          <SignInWithDiscord />
          <div className="text-center">
            Ainda não possui uma conta?{' '}
            <Link href={ROUTES.SIGN_UP} className="underline">
              Crie agora
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignInPage;

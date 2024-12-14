import { SignUpForm } from './_components/sign-up-form';

const SignUpPage = () => {
  return (
    <main className="h-screen">
      <section className="h-full container mx-auto">
        <div className="h-full w-1/2 mx-auto flex flex-col justify-center gap-3">
          <h1 className="text-3xl font-bold">Crie sua conta.</h1>

          <SignUpForm />
        </div>
      </section>
    </main>
  );
};

export default SignUpPage;

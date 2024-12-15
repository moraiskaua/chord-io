import { SignUpForm } from './_components/sign-up-form';

const SignUpPage = () => {
  return (
    <div className="h-full w-full space-y-3">
      <h1 className="text-3xl font-bold">Crie sua conta.</h1>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;

import { SignOutButton } from './_components/sign-out-button';
import { auth } from '@/lib/auth';

const WelcomePage = async () => {
  const session = await auth();

  return (
    <div>
      <h1 className="text-3xl font-bold mt-10">
        Bem-vindo, {session?.user?.name}
      </h1>

      <SignOutButton />
    </div>
  );
};

export default WelcomePage;

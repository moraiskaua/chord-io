import { SignInWithGoogle } from '@/components/sign-in-buttons/google-sign-in';
import { Account } from '@/entities/account';
import { auth } from '@/lib/auth';

const SettingsPage = async () => {
  const session = await auth();
  const isGoogleLinked = session?.user?.accounts.some(
    (account: Account) => account.provider === 'google',
  );

  return (
    <div className="h-screen">
      <div className="container mx-auto mt-10">
        <h1 className="text-center text-3xl font-bold mb-5">Vincular contas</h1>
        <SignInWithGoogle disabled={isGoogleLinked}>
          {isGoogleLinked ? 'Conta já vinculada' : 'Vincular com Google'}
        </SignInWithGoogle>
      </div>
    </div>
  );
};

export default SettingsPage;

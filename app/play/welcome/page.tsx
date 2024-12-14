import { auth } from '@/lib/auth';

const WelcomePage = async () => {
  const session = await auth();

  return (
    <main className="h-screen">
      <section className="h-full container mx-auto">
        <h1 className="text-3xl font-bold mt-10">
          Bem-vindo, {session?.user?.name}
        </h1>
      </section>
    </main>
  );
};

export default WelcomePage;

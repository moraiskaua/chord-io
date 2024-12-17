import { SignOutButton } from './_components/sign-out-button';

export default function Home() {
  return (
    <main className="h-screen">
      <section className="container mx-auto mt-10">
        <h1 className="text-center text-3xl font-bold">Chord.io</h1>
        <h3 className="text-center text-2xl font-bold">Em contrução...🚧</h3>

        <SignOutButton />
        <p className="text-center mt-5">
          por{' '}
          <a
            href="https://github.com/moraiskaua"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Kauã Morais.
          </a>
        </p>
      </section>
    </main>
  );
}

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

const WelcomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider>
      <main className="h-screen">
        <section className="h-full container mx-auto">{children}</section>
      </main>
    </SessionProvider>
  );
};

export default WelcomeLayout;

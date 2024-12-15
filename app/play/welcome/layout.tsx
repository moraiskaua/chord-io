import { ReactNode } from 'react';

const WelcomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="h-screen">
      <section className="h-full container mx-auto">{children}</section>
    </main>
  );
};

export default WelcomeLayout;

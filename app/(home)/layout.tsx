import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { HomeSidebar } from './_components/sidebar';
import { ReactNode } from 'react';

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <SidebarProvider>
      <HomeSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default HomeLayout;

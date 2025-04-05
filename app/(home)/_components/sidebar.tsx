import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { SignOutButton } from './sign-out-button';

export const HomeSidebar = async () => {
  const session = await auth();

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarGroup>
        <SidebarGroupLabel>Bem vindo, {session?.user?.name}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={ROUTES.HOME}>
                  <span>Jogar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={ROUTES.FREE_MODE}>
                  <span>Modo Livre</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={ROUTES.PROFILE}>
                  <span>Perfil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={ROUTES.LEADERBOARD}>
                  <span>Ranking</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarFooter>
        <SignOutButton>Sair</SignOutButton>
      </SidebarFooter>
    </Sidebar>
  );
};

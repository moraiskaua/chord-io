import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignInPage from './_components/sign-in/page';
import SignUpPage from './_components/sign-up/page';

const AuthPage = () => {
  return (
    <main className="h-screen">
      <section className="h-full container mx-auto flex justify-center items-center">
        <Tabs defaultValue="sign-in" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Entrar</TabsTrigger>
            <TabsTrigger value="sign-up">Criar conta</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <SignInPage />
          </TabsContent>
          <TabsContent value="sign-up">
            <SignUpPage />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default AuthPage;

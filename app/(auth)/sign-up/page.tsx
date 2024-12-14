import { useSignUpController } from './use-sign-up-controller';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SignUpPage = () => {
  const { signUpAction } = useSignUpController();

  return (
    <main className="h-screen">
      <section className="h-full container mx-auto">
        <div className="h-full w-1/2 mx-auto flex flex-col justify-center gap-3">
          <h1 className="text-3xl font-bold">Crie sua conta.</h1>

          <form action={signUpAction}>
            <Input name="name" type="text" placeholder="Nome" required />
            <Input name="email" type="email" placeholder="E-mail" required />
            <Input
              name="password"
              type="password"
              placeholder="Senha"
              required
            />
            <Button type="submit">Criar conta</Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default SignUpPage;

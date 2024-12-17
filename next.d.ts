declare global {
  namespace NodeJS {
    interface Global {
      user: User;
    }
  }

  declare module 'next-auth' {
    interface Session {
      user: User;
    }
  }
}

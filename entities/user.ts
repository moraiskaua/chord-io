import { Account } from '@/entities/account';

export type User = {
  id: string;
  image?: string;
  name: string;
  email: string;
  accounts?: Account[];
};

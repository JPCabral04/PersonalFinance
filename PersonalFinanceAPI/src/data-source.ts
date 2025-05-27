import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Account } from './entities/Account';
import { Transaction } from './entities/Transaction';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.NODE_ENV === 'test'
      ? process.env.DATABASE_URL_TEST
      : process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  dropSchema: process.env.NODE_ENV === 'test',
  entities: [User, Account, Transaction],
});

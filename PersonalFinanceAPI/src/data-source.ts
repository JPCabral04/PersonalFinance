import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Account } from './entities/Account';
import { Transaction } from './entities/Transaction';
import 'dotenv/config';

const isTest = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  database: isTest ? 'database_test' : process.env.DATABASE_NAME,
  synchronize: true,
  logging: false,
  dropSchema: isTest,
  entities: [User, Account, Transaction],
});

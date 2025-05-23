import { DataSource } from 'typeorm';
// import { User } from './entity/User';
// import { Account } from './entity/Account';
// import { Transaction } from './entity/Transaction';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [],
});

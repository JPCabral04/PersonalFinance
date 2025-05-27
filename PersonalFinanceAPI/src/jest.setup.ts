import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';

dotenv.config({ path: '.env.test.local' });

beforeAll(async () => {
  await AppDataSource.initialize();
  await AppDataSource.synchronize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

beforeEach(async () => {
  const entities = AppDataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);
    await repository.clear();
  }
});

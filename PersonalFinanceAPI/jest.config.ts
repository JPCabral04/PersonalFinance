import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
};

export default config;

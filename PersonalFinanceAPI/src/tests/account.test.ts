// src/tests/account.test.ts
import request from 'supertest';
import { app } from '../app';
import status from 'http-status';
import { createAndLoginTestUser } from '../utils/auth';
import { AccountType } from '../enums/AccountType.enum';

describe('Account Tests', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    ({ token, userId } = await createAndLoginTestUser());
  });

  describe('createAccount', () => {
    it('deve criar uma conta vinculada ao usuário do token', async () => {
      const newAccount = {
        name: 'Test Account',
        accountType: AccountType.CORRENTE,
        userId,
      };

      const res = await request(app)
        .post('/api/account')
        .set('Authorization', `Bearer ${token}`)
        .send(newAccount)
        .expect(status.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: newAccount.name,
          accountType: newAccount.accountType,
          balance: expect.any(String),
          user: expect.objectContaining({
            id: userId,
            name: expect.any(String),
            email: expect.any(String),
          }),
        }),
      );
    });

    it('deve retornar 404 se userId não existir', async () => {
      const res = await request(app)
        .post('/api/account')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'No User',
          accountType: AccountType.CORRENTE,
          balance: 500,
          userId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch(/usuário não encontrado/i);
    });
  });
});

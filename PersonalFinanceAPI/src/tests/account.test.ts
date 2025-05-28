import request from 'supertest';
import { app } from '../app';
import status from 'http-status';
import { createAndLoginTestUser } from '../utils/auth';
import { AccountType } from '../enums/AccountType.enum';
import * as accountService from '../services/accountService';

describe('Accounts Tests', () => {
  let token: string;
  let userId: string;
  let accountId: string;

  beforeAll(async () => {
    ({ token, userId } = await createAndLoginTestUser());
  });

  describe('createAccount', () => {
    it('deve criar uma nova conta com sucesso', async () => {
      const payload = {
        name: 'Minha Poupança',
        accountType: AccountType.POUPANCA,
        balance: 1500.735,
        userId,
      };

      const res = await request(app)
        .post('/api/account')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.CREATED);

      expect(res.body).toMatchObject({
        id: expect.any(String),
        name: payload.name,
        accountType: payload.accountType,
        balance: expect.any(Number),
      });
      expect(res.body.user.id).toBe(userId);
      accountId = res.body.id;
    });

    it('deve retornar erro 400 se o balance for negativo', async () => {
      const payload = {
        name: 'Saldo Negativo',
        accountType: AccountType.CORRENTE,
        balance: -100,
        userId,
      };

      const res = await request(app)
        .post('/api/account')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toMatch('Saldo deve ser um número positivo');
    });

    it('deve retornar erro 400 se campos obrigatórios estiverem ausentes', async () => {
      const payload = { userId };

      const res = await request(app)
        .post('/api/account')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toMatch('Ausência de campos obrigatórios');
    });

    it('deve retornar erro 400 se accountType for inválido', async () => {
      const payload = {
        name: 'Tipo Inválido',
        accountType: 'INVALIDO',
        balance: 500,
        userId,
      };

      const res = await request(app)
        .post('/api/account')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toMatch('Credenciais inválidas');
    });

    it('deve retornar erro 404 se userId não existir', async () => {
      const res = await request(app)
        .post('/api/account')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Sem Usuário',
          accountType: AccountType.CORRENTE,
          balance: 500,
          userId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch('Usuário não encontrado');
    });
  });

  describe('updateAccount', () => {
    it('deve atualizar campos da conta com sucesso', async () => {
      const updates = {
        name: 'Nome Atualizado',
        accountType: AccountType.CORRENTE,
        balance: 2000,
      };

      const res = await request(app)
        .put(`/api/account/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates)
        .expect(status.OK);

      expect(res.body).toMatchObject({
        name: updates.name,
        accountType: updates.accountType,
        balance: expect.any(Number),
      });
      expect(parseFloat(res.body.balance)).toBeCloseTo(updates.balance);
    });

    it('deve retornar 400 quando o saldo for negativo', async () => {
      const invalid = { balance: -500 };

      const res = await request(app)
        .put(`/api/account/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(invalid)
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toMatch('Saldo deve ser um número positivo');
    });

    it('deve retornar 404 se a conta não existir', async () => {
      const res = await request(app)
        .put('/api/account/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'NaoExiste' })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch('Conta não encontrada ou acesso negado');
    });
  });

  describe('getAccounts', () => {
    it('deve retornar todas as contas do usuário autenticado', async () => {
      const res = await request(app)
        .get(`/api/account/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(status.OK);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      res.body.forEach((acct: any) => {
        expect(acct).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          accountType: expect.any(String),
          balance: expect.any(Number),
        });
      });
    });

    it('deve retornar 404 se não houver contas', async () => {
      await accountService.clearAccounts();
      const res = await request(app)
        .get(`/api/account/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch('Nenhuma conta encontrada');
    });
  });

  describe('deleteAccount', () => {
    beforeAll(async () => {
      const { id } = await accountService.createAccount(
        'Conta Delete',
        AccountType.CORRENTE,
        500,
        userId,
      );
      accountId = id;
    });

    it('deve deletar a conta com sucesso', async () => {
      const res = await request(app)
        .delete(`/api/account/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(status.ACCEPTED);

      expect(res.body).toEqual({ message: 'Conta deletada com sucesso' });
    });

    it('deve retornar 404 ao deletar conta inexistente', async () => {
      await accountService.clearAccounts();
      const res = await request(app)
        .delete(`/api/account/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch('Conta não encontrada ou acesso negado');
    });
  });
});

import request from 'supertest';
import { app } from '../app';
import status from 'http-status';
import { createAndLoginTestUser } from '../utils/auth';
import { AccountType } from '../enums/AccountType.enum';
import * as accountService from '../services/accountService';
import * as transactionService from '../services/transactionService';
import { TransactionType } from '../enums/TransactionType.enum';

describe('Transactions Tests', () => {
  let token: string;
  let userId: string;
  let accA: string;
  let accB: string;

  beforeAll(async () => {
    ({ token, userId } = await createAndLoginTestUser());

    const a = await accountService.createAccount(
      'Conta A',
      AccountType.CORRENTE,
      1000,
      userId,
    );
    const b = await accountService.createAccount(
      'Conta B',
      AccountType.CORRENTE,
      500,
      userId,
    );
    accA = a.id;
    accB = b.id;
  });

  describe('transfer', () => {
    it('deve criar transferência com sucesso', async () => {
      const payload = {
        originAccount: accA,
        destinationAccount: accB,
        amount: 200,
        description: 'Teste',
      };

      const res = await request(app)
        .post('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.OK);

      expect(res.body).toMatchObject({
        id: expect.any(String),
        amount: 200,
        description: 'Teste',
        transactionType: TransactionType.TRANSFER,
      });

      const originAfter = await accountService.updateAccount({
        accountId: accA,
        userId,
      });
      const destAfter = await accountService.updateAccount({
        accountId: accB,
        userId,
      });

      expect(Number(originAfter.balance)).toBe(800);
      expect(Number(destAfter.balance)).toBe(700);
    });

    it('deve retornar 400 se faltar originAccount', async () => {
      const payload = { destinationAccount: accB, amount: 100 };

      const res = await request(app)
        .post('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toMatch('ID da conta de origem inválido');
    });

    it('deve retornar 400 se faltar destinationAccount', async () => {
      const payload = { originAccount: accA, amount: 100 };

      const res = await request(app)
        .post('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toMatch('ID da conta de destino inválido');
    });

    it('deve retornar 400 se originAccount === destinationAccount', async () => {
      const payload = {
        originAccount: accA,
        destinationAccount: accA,
        amount: 100,
      };

      const res = await request(app)
        .post('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toMatch(
        'Conta de origem e destino devem ser diferentes',
      );
    });

    it('deve retornar 400 se amount inválido', async () => {
      const payload = {
        originAccount: accA,
        destinationAccount: accB,
        amount: -50,
      };

      const res = await request(app)
        .post('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toMatch(
        'Valor da transferência deve ser um número positivo',
      );
    });

    it('404 se conta não existir', async () => {
      const res = await request(app)
        .post('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .send({
          originAccount: '00000000-0000-0000-0000-000000000000',
          destinationAccount: accB,
          amount: 50,
        })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch(
        'Conta de origem ou destino não encontradas',
      );
    });

    it('400 se saldo insuficiente', async () => {
      await request(app)
        .post('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .send({
          originAccount: accB,
          destinationAccount: accA,
          amount: 1000,
        })
        .expect(status.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toMatch('Saldo insuficiente');
        });
    });

    it('deve retornar 400 se description não for string', async () => {
      const payload = {
        originAccount: accA,
        destinationAccount: accB,
        amount: 100,
        description: 123 as any,
      };

      await request(app)
        .post('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
        .expect(status.BAD_REQUEST)
        .expect((res) => {
          expect(res.body.message).toMatch('Descrição inválida');
        });
    });
  });

  describe('getTransactions', () => {
    it('deve listar transações com displayType correto', async () => {
      await transactionService.transfer(accA, accB, 50, 'Outro');

      const res = await request(app)
        .get('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .query({ accountId: accA })
        .expect(status.OK);

      expect(Array.isArray(res.body)).toBe(true);

      res.body.forEach((tx: any) => {
        expect(tx).toHaveProperty('displayType');

        if (tx.originAccount.id === accA) {
          expect(tx.displayType).toBe(TransactionType.DEBIT);
        } else {
          expect(tx.displayType).toBe(TransactionType.CREDIT);
        }
      });
    });

    it('deve listar transações filtrando por accountId', async () => {
      const res = await request(app)
        .get('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .query({ accountId: accA })
        .expect(status.OK);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      res.body.forEach((tx: any) => {
        expect(
          tx.originAccount.id === accA || tx.destinationAccount.id === accA,
        ).toBe(true);
      });
    });

    it('deve filtrar por dataFrom', async () => {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 7);

      const res = await request(app)
        .get('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .query({ dateFrom: dateFrom.toISOString() })
        .expect(status.OK);

      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach((tx: any) => {
        expect(new Date(tx.transactionDate) >= dateFrom).toBe(true);
      });
    });

    it('deve filtrar por dateTo', async () => {
      const dateTo = new Date();
      dateTo.setDate(dateTo.getDate() + 1);

      const res = await request(app)
        .get('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .query({ dateTo: dateTo.toISOString() })
        .expect(status.OK);

      res.body.forEach((tx: any) =>
        expect(new Date(tx.transactionDate) <= dateTo).toBe(true),
      );
    });

    it('deve retornar 404 se não encontrar transações', async () => {
      await transactionService.clearTransactions();

      await request(app)
        .get('/api/transaction')
        .set('Authorization', `Bearer ${token}`)
        .expect(status.NOT_FOUND)
        .expect((res) => {
          expect(res.body.message).toMatch(/nenhuma transação encontrada/i);
        });
    });
  });
});

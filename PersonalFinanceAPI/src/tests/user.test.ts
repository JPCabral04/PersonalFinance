import request from 'supertest';
import { app } from '../app';
import status from 'http-status';
import * as userService from '../services/userService';
import { createAndLoginTestUser } from '../utils/auth';

describe('User Tests', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    ({ token, userId } = await createAndLoginTestUser());
  });

  afterEach(async () => {
    await userService.clearUsers();
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const res = await request(app)
        .get('/api/user/')
        .set('Authorization', `Bearer ${token}`)
        .expect(status.OK);

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'testuser',
            email: 'test@example.com',
            id: expect.any(String),
          }),
        ]),
      );
    });

    it('deve retornar 404, nenhum usuário encontrado', async () => {
      await userService.clearUsers();

      const res = await request(app)
        .get('/api/user/')
        .set('Authorization', `Bearer ${token}`)
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch('Nenhum usuário encontrado');
    });
  });
  describe('getUserById', () => {
    it('deve retornar o usuário do id especificado', async () => {
      const res = await request(app)
        .get(`/api/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(status.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: 'testuser',
          email: 'test@example.com',
          id: expect.any(String),
        }),
      );
    });

    it('deve retornar 404, usuário não encontrado', async () => {
      await userService.clearUsers();

      const res = await request(app)
        .get(`/api/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch('Usuário não encontrado');
    });
  });
  describe('updateUser', () => {
    it('deve atualizar os dados do usuário', async () => {
      const res = await request(app)
        .put(`/api/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'updatedUser',
          email: 'updated@example.com',
        })
        .expect(status.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: 'updatedUser',
          email: 'updated@example.com',
          id: expect.any(String),
        }),
      );
    });

    it('deve retornar 404 se o usuário não for encontrado', async () => {
      await userService.clearUsers();

      const res = await request(app)
        .put(`/api/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'noUser',
        })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch('Usuário não encontrado');
    });
  });

  describe('deleteUser', () => {
    it('deve deletar o usuário com sucesso', async () => {
      const res = await request(app)
        .delete(`/api/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(status.ACCEPTED);

      expect(res.body.message).toMatch('Usuário deletado');
    });

    it('deve retornar 404 ao tentar deletar usuário inexistente', async () => {
      await userService.clearUsers();

      const res = await request(app)
        .delete(`/api/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(status.NOT_FOUND);

      expect(res.body.message).toMatch('Usuário não encontrado');
    });
  });
});

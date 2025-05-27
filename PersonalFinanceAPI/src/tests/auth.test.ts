import request from 'supertest';
import { app } from '../app';
import status from 'http-status';

describe('Authentication Tests', () => {
  describe('Register', () => {
    it('deve cadastrar um usuário', async () => {
      const newUser = {
        name: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      };
      const res = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(status.CREATED);
      expect(res.body).toEqual({
        name: newUser.name,
        email: newUser.email,
        id: expect.any(String),
      });
    });

    it('deve retornar 400 ao tentar registrar com email já cadastrado', async () => {
      const invalidUser = {
        name: 'testuser2',
        email: 'test@example.com',
        password: 'testpassword',
      };
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);
      expect(res.body.message).toMatch('Email já cadastrado');
    });

    it('deve retornar 400 ao tentar registrar com campos obrigatórios ausentes', async () => {
      const invalidUser = {
        email: 'test2@example.com',
        password: 'testpassword',
      };
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);
      expect(res.body.message).toMatch('Campos obrigatórios ausentes');
    });

    it('deve retornar 400 ao tentar registrar com senha inválida', async () => {
      const invalidUser = {
        name: 'test3',
        email: 'test3@example.com',
        password: '123',
      };
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);
      expect(res.body.message).toMatch('Senha inválida');
    });
  });

  describe('Login', () => {
    it('deve fazer o login de um usuário', async () => {
      const userCredentials = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const res = await request(app)
        .post('/api/auth/login')
        .send(userCredentials)
        .expect(status.OK);
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.token).toBe('string');
      expect(res.body.token.length).toBeGreaterThan(0);
    });

    it('deve retornar 401 ao tentar logar com email não cadastrado', async () => {
      const invalidCredentials = {
        email: 'seila@gmail.com',
        password: 'testpassword',
      };
      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials)
        .expect(401);
      expect(res.body.message).toMatch('Credenciais inválidas');
    });

    it('deve retornar 401 ao tentar logar com senha incorreta', async () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: 'test1234',
      };
      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials)
        .expect(401);
      expect(res.body.message).toMatch('Credenciais inválidas');
    });

    it('deve retornar 400 ao tentar logar com campos vazios', async () => {
      const invalidCredentials = {
        email: '',
        password: 'testpassword',
      };
      const res = await request(app)
        .post('/api/auth/login')
        .send(invalidCredentials)
        .expect(400);
      expect(res.body.message).toMatch('email e password são obrigatórios');
    });
  });
});

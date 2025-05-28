// test/utils/auth.ts
import request from 'supertest';
import { app } from '../app';
import status from 'http-status';

export async function createAndLoginTestUser() {
  const email = 'test@example.com';
  const password = 'testpassword';

  const newUser = {
    name: 'testuser',
    email,
    password,
  };

  const userRes = await request(app)
    .post('/api/auth/register')
    .send(newUser)
    .expect(status.CREATED);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
    .expect(status.OK);

  return {
    token: loginRes.body.token as string,
    userId: userRes.body.id as string,
  };
}

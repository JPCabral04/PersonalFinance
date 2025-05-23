import { Router } from 'express';
import { login, register } from '../controller/authController';

export const authRoute = Router();

authRoute.post('/register', register);
authRoute.post('/login', login);

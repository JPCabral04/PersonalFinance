import { Router } from 'express';
import { login, register } from '../controllers/authController';
import {
  validateLoginInput,
  validateRegisterInput,
} from '../middlewares/authMiddleware';

export const authRoute = Router();

authRoute.post('/register', validateRegisterInput, register);
authRoute.post('/login', validateLoginInput, login);

export default authRoute;

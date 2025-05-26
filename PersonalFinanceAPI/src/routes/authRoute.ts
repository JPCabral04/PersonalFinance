import { Router } from 'express';
import { login, register } from '../controllers/authController';
import {
  validateLoginInput,
  validateRegisterInput,
} from '../middlewares/authMiddleware';

export const authRoute = Router();

authRoute.post('/register', register, validateRegisterInput);
authRoute.post('/login', login, validateLoginInput);

export default authRoute;

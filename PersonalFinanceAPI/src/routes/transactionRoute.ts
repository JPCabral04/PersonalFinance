import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
  createTransaction,
  getTransactions,
} from '../controller/transactionController';

export const transactionRoute = Router();

transactionRoute.use(authenticate);

transactionRoute.post('/', createTransaction);
transactionRoute.get('/', getTransactions);

export default transactionRoute;

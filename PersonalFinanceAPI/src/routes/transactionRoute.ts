import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
  createTransaction,
  getTransactions,
} from '../controllers/transactionController';
import { validateTransfer } from '../middlewares/transactionValidation';

export const transactionRoute = Router();

transactionRoute.use(authenticate);

transactionRoute.post('/', validateTransfer, createTransaction);
transactionRoute.get('/', getTransactions);

export default transactionRoute;

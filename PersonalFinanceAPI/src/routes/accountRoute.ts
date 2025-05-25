import { Router } from 'express';
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from '../controller/accountController';
import { authenticate } from '../middlewares/authMiddleware';

export const accountRoute = Router();

accountRoute.use(authenticate);

accountRoute.post('/', createAccount);
accountRoute.get('/:id', getAccounts);
accountRoute.put('/:id', updateAccount);
accountRoute.delete('/:id', deleteAccount);

export default accountRoute;

import { Router } from 'express';
import {
  createAccount,
  deleteAccount,
  getAccounts,
  updateAccount,
} from '../controllers/accountController';
import { authenticate } from '../middlewares/authMiddleware';
import {
  validateCreateAccount,
  validateUpdateAccount,
} from '../middlewares/accountValidation';

export const accountRoute = Router();

accountRoute.use(authenticate);

accountRoute.post('/', validateCreateAccount, createAccount);
accountRoute.get('/:id', getAccounts);
accountRoute.put('/:id', validateUpdateAccount, updateAccount);
accountRoute.delete('/:id', deleteAccount);

export default accountRoute;

// routes/userRoutes.ts ou similar
import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controller/userController';
import { authenticate } from '../middlewares/authMiddleware';

const userRoute = Router();

userRoute.use(authenticate);

userRoute.get('/', getAllUsers);
userRoute.get('/:id', getUserById);
userRoute.put('/:id', updateUser);
userRoute.delete('/:id', deleteUser);

export default userRoute;

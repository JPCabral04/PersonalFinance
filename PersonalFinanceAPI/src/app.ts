import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import accountRoute from './routes/accountRoute';
import transactionRoute from './routes/transactionRoute';
import { notFoundHandler } from './middlewares/notFoundHandler';

export const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/account', accountRoute);
app.use('/api/transaction', transactionRoute);

app.use(notFoundHandler);
app.use(errorHandler);

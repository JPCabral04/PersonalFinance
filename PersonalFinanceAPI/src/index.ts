import { AppDataSource } from './data-source';
import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import accountRoute from './routes/accountRoute';
import transactionRoute from './routes/transactionRoute';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/account', accountRoute);
app.use('/transaction', transactionRoute);

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco:', err);
  });

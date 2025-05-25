import { AppDataSource } from './data-source';
import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import accountRoute from './routes/accountRoute';
import transactionRoute from './routes/transactionRoute';
import { notFoundHandler } from './middlewares/notFoundHandler';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/account', accountRoute);
app.use('/api/transaction', transactionRoute);

// Middleware para lidar com rotas não encontradas
app.use(notFoundHandler);
// Middleware para lidar com erros
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

import { app } from './app';
import { AppDataSource } from './data-source';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Conectado ao banco de dados!');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => console.error('Erro ao conectar no banco', err));

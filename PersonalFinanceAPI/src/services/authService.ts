import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepo = AppDataSource.getRepository(User);

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const exists = await userRepo.findOne({ where: { email } });
  if (exists) throw { status: 400, message: 'Email já cadastrado' };

  const hashed = await bcrypt.hash(password, 10);
  const user = userRepo.create({ name, email, password: hashed });
  return userRepo.save(user);
};

export const signUser = async (email: string, password: string) => {
  const user = await userRepo.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw { status: 401, message: 'Credenciais inválidas' };
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: '7d',
    },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

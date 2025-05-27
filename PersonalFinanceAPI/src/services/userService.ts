import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const userRepo = AppDataSource.getRepository(User);

export const getAllUsers = async () => {
  const users = userRepo.find();
  if (!users) throw { status: 404, message: 'Nenhum usuário encontrado' };
  return users;
};

export const getUserById = async (id: string) => {
  const user = userRepo.findOneBy({ id });
  if (!user) throw { status: 404, message: 'Usuário não encontrado' };
  return user;
};

export const updateUser = async (id: string, data: any) => {
  const user = await userRepo.findOneBy({ id });
  if (!user) throw { status: 404, message: 'Usuário não encontrado' };

  user.name = data.name ?? user.name;
  user.email = data.email ?? user.email;

  return userRepo.save(user);
};

export const deleteUser = async (id: string) => {
  const result = await userRepo.delete(id);
  if (result.affected === 0)
    throw { status: 404, message: 'Usuário não encontrado' };
};

export const clearUsers = async () => {
  await userRepo.clear();
};

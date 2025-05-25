import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const userRepo = AppDataSource.getRepository(User);

export const getAllUsers = async () => {
  return userRepo.find();
};

export const getUserById = async (id: string) => {
  return userRepo.findOneBy({ id });
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

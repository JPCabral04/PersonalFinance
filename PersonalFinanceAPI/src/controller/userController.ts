import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as userService from '../services/userService';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.getAllUsers();
    res.status(status.OK).json(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    res.status(status.OK).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(status.OK).json(user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(status.ACCEPTED).json({ message: 'Usuário deletado' });
  } catch (err) {
    next(err);
  }
};

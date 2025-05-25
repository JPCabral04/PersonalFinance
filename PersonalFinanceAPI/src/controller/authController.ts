import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { createUser, signUser } from '../services/authService';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;
    const user = await createUser(name, email, password);
    res.status(status.CREATED).json(user);
  } catch (err: any) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const token = await signUser(email, password);
    res.status(status.OK).json({ token });
  } catch (err: any) {
    next(err);
  }
};

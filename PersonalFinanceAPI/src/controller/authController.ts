import { status } from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { createUser, signUser } from '../services/authService';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(status.BAD_REQUEST)
        .json({ error: 'name, email e password são obrigatórios' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      res
        .status(status.BAD_REQUEST)
        .json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

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

    if (!email || !password) {
      res
        .status(status.BAD_REQUEST)
        .json({ error: 'email e password são obrigatórios' });
    }

    const token = await signUser(email, password);
    res.status(status.OK).json({ token });
  } catch (err: any) {
    next(err);
  }
};

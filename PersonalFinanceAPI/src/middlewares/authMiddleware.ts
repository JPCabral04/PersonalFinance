import { NextFunction, Request, RequestHandler, Response } from 'express';
import status from 'http-status';
import jwt from 'jsonwebtoken';
import { JwtUserPayload } from '../@types/express';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(status.UNAUTHORIZED).json({ message: 'Token ausente' });
    return;
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(status.UNAUTHORIZED).json({ message: 'Token inválido' });
    return;
  }
};

export const validateRegisterInput: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Campos obrigatórios ausentes' });
    return;
  }

  if (typeof password !== 'string' || password.length < 6) {
    res.status(400).json({ message: 'Senha inválida' });
    return;
  }

  next();
};

export const validateLoginInput: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(status.BAD_REQUEST)
      .json({ message: 'email e password são obrigatórios' });
    return;
  }

  next();
};

import { NextFunction, Request, Response } from 'express';
import status from 'http-status';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(status.UNAUTHORIZED).json({ message: 'Token ausente' });

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(status.UNAUTHORIZED).json({ message: 'Token inválido' });
  }
};

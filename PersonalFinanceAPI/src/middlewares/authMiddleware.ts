import { RequestHandler } from 'express';
import status from 'http-status';
import jwt from 'jsonwebtoken';

export const authMiddleware: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(status.UNAUTHORIZED).json({ message: 'Token ausente' });
    return;
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    res.status(status.UNAUTHORIZED).json({ message: 'Token inválido' });
    return;
  }
};

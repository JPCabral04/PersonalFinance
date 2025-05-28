// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import status from 'http-status';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.status || status.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Erro interno do servidor';

  res.status(statusCode).json({ status: statusCode, message });
};

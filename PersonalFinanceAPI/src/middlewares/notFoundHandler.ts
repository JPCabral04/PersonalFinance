import { Request, Response } from 'express';
import status from 'http-status';

export const notFoundHandler = (err: any, req: Request, res: Response) => {
  const statusCode = err.status || status.NOT_FOUND;
  const message = err.message || 'Essa rota não existe';

  res.status(statusCode).json({ error: message });
};

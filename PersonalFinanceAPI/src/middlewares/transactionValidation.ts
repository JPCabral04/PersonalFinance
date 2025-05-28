import { Request, Response, NextFunction } from 'express';

export const validateTransfer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { originAccountId, destinationAccountId, amount, description } =
    req.body;

  if (!originAccountId || typeof originAccountId !== 'string') {
    res.status(400).json({ message: 'ID da conta de origem inválido' });
    return;
  }

  if (!destinationAccountId || typeof destinationAccountId !== 'string') {
    res.status(400).json({ message: 'ID da conta de destino inválido' });
    return;
  }

  if (originAccountId === destinationAccountId) {
    res
      .status(400)
      .json({ message: 'Conta de origem e destino devem ser diferentes' });
    return;
  }

  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    res
      .status(400)
      .json({ message: 'Valor da transferência deve ser um número positivo' });
    return;
  }

  if (description && typeof description !== 'string') {
    res.status(400).json({ message: 'Descrição inválida' });
    return;
  }

  next();
};

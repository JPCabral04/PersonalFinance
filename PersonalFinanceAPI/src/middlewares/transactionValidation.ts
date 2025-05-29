import { Request, Response, NextFunction } from 'express';

export const validateTransfer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { originAccount, destinationAccount, amount, description } = req.body;

  if (!originAccount || typeof originAccount !== 'string') {
    res.status(400).json({ message: 'ID da conta de origem inválido' });
    return;
  }

  if (!destinationAccount || typeof destinationAccount !== 'string') {
    res.status(400).json({ message: 'ID da conta de destino inválido' });
    return;
  }

  if (originAccount === destinationAccount) {
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

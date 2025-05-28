import { Request, Response, NextFunction } from 'express';
import { AccountType } from '../enums/AccountType.enum';

const isValidAccountType = (value: any): boolean => {
  return Object.values(AccountType).includes(value);
};

export const validateCreateAccount = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, accountType, balance } = req.body;

  if (
    !name ||
    typeof name !== 'string' ||
    name.trim().length === 0 ||
    !accountType
  ) {
    res.status(400).json({ message: 'Ausência de campos obrigatórios' });
    return;
  }

  if (!isValidAccountType(accountType)) {
    res.status(400).json({ message: 'Tipo de conta inválido' });
    return;
  }

  if (
    balance !== undefined &&
    (typeof balance !== 'number' || isNaN(balance) || balance < 0)
  ) {
    res.status(400).json({ message: 'Saldo deve ser um número positivo' });
    return;
  }

  next();
};

export const validateUpdateAccount = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, accountType, balance } = req.body;

  if (
    name !== undefined &&
    (typeof name !== 'string' || name.trim().length === 0)
  ) {
    res.status(400).json({ message: 'Nome inválido' });
    return;
  }

  if (accountType !== undefined && !isValidAccountType(accountType)) {
    res.status(400).json({ message: 'Tipo de conta inválido' });
    return;
  }

  if (
    balance !== undefined &&
    (typeof balance !== 'number' || isNaN(balance) || balance < 0)
  ) {
    res.status(400).json({ message: 'Saldo deve ser um número positivo' });
    return;
  }

  next();
};

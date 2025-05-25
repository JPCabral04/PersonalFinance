import status from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as accountService from '../services/accountService';

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, accountType, balance } = req.body;

  try {
    const account = await accountService.createAccount(
      name,
      accountType,
      balance,
      req.params.id,
    );

    res.status(status.CREATED).json(account);
  } catch (err) {
    next(err);
  }
};

export const getAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accounts = await accountService.getAccounts(req.params.id);
    res.status(status.OK).json(accounts);
  } catch (err) {
    next(err);
  }
};

export const updateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, accountType, balance } = req.body;

  try {
    const account = await accountService.updateAccount({
      accountId: req.params.id,
      userId: req.user.id,
      name,
      accountType,
      balance,
    });

    res.status(status.OK).json(account);
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accountId = req.params.id;
  const userId = req.user.id;
  try {
    await accountService.deleteAccount(accountId, userId);
    res.status(status.ACCEPTED).json({ message: 'Conta deletada com sucesso' });
  } catch (err) {
    next(err);
  }
};

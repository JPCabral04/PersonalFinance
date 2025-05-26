import { NextFunction, Request, Response } from 'express';
import * as transactionService from '../services/transactionService';
import status from 'http-status';

export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { originAccount, destinationAccount, amount, description } = req.body;
  try {
    const transaction = await transactionService.transfer(
      originAccount,
      destinationAccount,
      amount,
      description,
    );
    res.status(status.OK).json(transaction);
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { accountId, dateFrom, dateTo } = req.query;
  try {
    const transactions = await transactionService.getTransactions(
      accountId as string | undefined,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined,
    );
    res.status(status.OK).json(transactions);
  } catch (err) {
    next(err);
  }
};

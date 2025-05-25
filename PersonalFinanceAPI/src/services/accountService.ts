import status from 'http-status';
import { AppDataSource } from '../data-source';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/User';
import { Account } from '../entities/Account';
import { AccountType } from '../enums/AccountType.enum';

const userRepo = AppDataSource.getRepository(User);
const accountRepo = AppDataSource.getRepository(Account);

export const createAccount = async (
  name: string,
  accountType: AccountType,
  balance: number,
  userId: string,
) => {
  const user = await userRepo.findOneBy({ id: userId });
  if (!user) throw { status: 404, message: 'Usuário não encontrado' };

  const account = accountRepo.create({
    name,
    accountType,
    balance: balance ?? 0,
    user,
  });

  return accountRepo.save(account);
};

export const getAccounts = async (userId: string) => {
  const accounts = await accountRepo.find({
    where: { user: { id: userId } },
  });

  if (!accounts) throw { status: 404, message: 'Nenhuma conta encontrada' };
  return accounts;
};

export const updateAccount = async ({
  accountId,
  userId,
  name,
  accountType,
  balance,
}: {
  accountId: string;
  userId: string;
  name?: string;
  accountType?: AccountType;
  balance?: number;
}) => {
  const account = await accountRepo.findOne({
    where: {
      id: accountId,
      user: { id: userId },
    },
  });

  if (!account) {
    throw {
      status: 404,
      message: 'Conta não encontrada ou acesso negado',
    };
  }

  account.name = name ?? account.name;
  account.accountType = accountType ?? account.accountType;
  account.balance = balance ?? account.balance;

  return await accountRepo.save(account);
};

export const deleteAccount = async (accountId: string, userId: string) => {
  const account = await accountRepo.findOne({
    where: {
      id: accountId,
      user: { id: userId },
    },
  });

  if (!account)
    throw {
      status: 404,
      message: 'Conta não encontrada ou acesso negado',
    };

  return await accountRepo.remove(account);
};

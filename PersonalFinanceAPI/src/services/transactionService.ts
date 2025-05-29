import { AppDataSource } from '../data-source';
import { Account } from '../entities/Account';
import { Transaction } from '../entities/Transaction';
import { TransactionType } from '../enums/TransactionType.enum';

const transactionRepo = AppDataSource.getRepository(Transaction);
const accoutRepo = AppDataSource.getRepository(Account);

export const transfer = async (
  originAccount: string,
  destinationAccount: string,
  amount: number,
  description?: string,
): Promise<Transaction> => {
  const origin = await accoutRepo.findOneBy({ id: originAccount });
  const destination = await accoutRepo.findOneBy({
    id: destinationAccount,
  });

  if (!origin || !destination)
    throw {
      status: 404,
      message: 'Conta de origem ou destino não encontradas',
    };

  if (origin.balance < amount)
    throw {
      status: 400,
      message: 'Saldo insuficiente',
    };

  origin.balance -= amount;
  destination.balance += amount;

  await accoutRepo.save(origin);
  await accoutRepo.save(destination);

  const transaction = transactionRepo.create({
    transactionType: TransactionType.TRANSFER,
    originAccount: origin,
    destinationAccount: destination,
    amount,
    description,
  });
  await transactionRepo.save(transaction);

  return transaction;
};

export const getTransactions = async (
  accountId?: string,
  dateFrom?: Date,
  dateTo?: Date,
) => {
  const qb = transactionRepo
    .createQueryBuilder('tx')
    .leftJoinAndSelect('tx.originAccount', 'origin')
    .leftJoinAndSelect('tx.destinationAccount', 'destination')
    .orderBy('tx.transactionDate', 'DESC');

  if (accountId) {
    qb.andWhere('(origin.id = :accountId OR destination.id = :accountId)', {
      accountId,
    });
  }
  if (dateFrom) {
    qb.andWhere('tx.transactionDate >= :dateFrom', { dateFrom });
  }
  if (dateTo) {
    qb.andWhere('tx.transactionDate <= :dateTo', { dateTo });
  }

  const transactions = await qb.getMany();
  if (transactions.length === 0) {
    throw {
      status: 404,
      message: 'Nenhuma transação encontrada',
    };
  }

  return transactions.map((tx) => {
    const displayType: TransactionType =
      accountId && tx.originAccount.id === accountId
        ? TransactionType.DEBIT
        : TransactionType.CREDIT;
    return { ...tx, displayType };
  });
};

export const clearTransactions = async () => {
  await transactionRepo.createQueryBuilder().delete().execute();
};

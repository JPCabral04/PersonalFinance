import { AppDataSource } from '../data-source';
import { Account } from '../entities/Account';
import { Transaction } from '../entities/Transaction';
import { TransactionType } from '../enums/TransactionType.enum';

const transactionRepo = AppDataSource.getRepository(Transaction);
const accoutRepo = AppDataSource.getRepository(Account);

export const transfer = async (
  originAccountId: string,
  destinationAccountId: string,
  amount: number,
  description?: string,
) => {
  const origin = await accoutRepo.findOneBy({ id: originAccountId });
  const destination = await accoutRepo.findOneBy({
    id: destinationAccountId,
  });

  if (!origin || !destination)
    throw {
      status: 404,
      message: 'Conta de origem ou destino não encontradas',
    };

  if (origin.balance < amount)
    throw {
      status: 400,
      message: 'Saldo insuficiente na conta de origem',
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

  return {
    message: 'Transferência realizada com sucesso',
    transaction,
  };
};

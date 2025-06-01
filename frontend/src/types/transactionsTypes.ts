import type { Account } from "./accountsType";

export interface TransferPayload {
  originAccount: string;
  destinationAccount: string;
  amount: number;
  description?: string;
}

export type TransactionType =
  | 'Transferência'
  | 'Crédito'
  | 'Débito';

export interface Transaction {
  id: string;
  transactionType: TransactionType;
  originAccount: Account;
  destinationAccount: Account;
  amount: number;
  description?: string;
  transactionDate: string;
}

export interface GetTransactionsQueryParams {
  accountId?: string;
  dateFrom?: string;
  dateTo?: string;
}
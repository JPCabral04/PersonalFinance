import type { User } from "./auth";

export type AccountType =
  | 'Corrente'
  | 'Poupança'
  | 'Crédito'
  | 'Investimento';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  userId: string;
  // outgoingTransactions?: Transaction[];
  // incomingTransactions?: Transaction[];
}

export interface createAccountPayload {
  name: string;
  accountType: AccountType;
  balance?: number;
  userId: string;
}

export interface UpdateAccountPayload {
  name?: string;
  accountType?: AccountType;
  balance?: number;
}
export type AccountType =
  | 'Corrente'
  | 'Poupança'
  | 'Crédito'
  | 'Investimento';

export interface Account {
  id: string;
  name: string;
  accountType: AccountType;
  balance: number;
  userId: string;
  // outgoingTransactions?: Transaction[];
  // incomingTransactions?: Transaction[];
}

export interface CreateAccountPayload {
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
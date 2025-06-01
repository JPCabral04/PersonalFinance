import type { GetTransactionsQueryParams, Transaction, TransferPayload } from '@/types/transactionsTypes';
import api from './api';

export const createTransfer = async (payload: TransferPayload): Promise<Transaction> => {
  const response = await api.post<Transaction>('/transaction', payload);
  return response.data;
}

export const getTransactions = async (params?: GetTransactionsQueryParams): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>('/transaction', { params });
  return response.data;
}
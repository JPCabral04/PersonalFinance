import type { Account, CreateAccountPayload, UpdateAccountPayload } from '@/types/accountsType';
import api from './api';

export const createAccount = async (payload: CreateAccountPayload): Promise<Account> => {
  const response = await api.post<Account>('/account', payload);
  return response.data;
}

export const getAccounts = async (userId: string): Promise<Account[]> => {
  const response = await api.get<Account[]>(`/account/${userId}`);
  return response.data;
}

export const updateAccount = async (accountId: string, payload: UpdateAccountPayload): Promise<Account> => {
  const response = await api.put<Account>(`/account/${accountId}`, payload);
  return response.data;
}

export const deleteAccount = async (accountId: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/account/${accountId}`);
  return response.data;
} 
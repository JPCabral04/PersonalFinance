import type { User } from '@/types/authType';
import api from './api';
import type { UpdateUserPayload } from '@/types/userType';

export const getUser = async (userId: string): Promise<User> => {
  const response = await api.post<User>(`/user/${userId}`);
  return response.data;
}

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<User> => {
  const response = await api.put<User>(`/user/${userId}`, payload);
  return response.data;
};


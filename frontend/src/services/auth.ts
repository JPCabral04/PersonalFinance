import type { AuthResponse, User, UserLoginPayload, UserRegisterPayload } from '@/interfaces/auth';
import api from './api';

export const register = async (payload: UserRegisterPayload): Promise<User> => {
  const response = await api.post<User>('/auth/register', payload);
  return response.data;
};

export const login = async (payload: UserLoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', payload)

  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token)
  }

  return response.data;
}
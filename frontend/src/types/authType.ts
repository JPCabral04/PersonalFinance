import type { Account } from "./accountsType";

export interface UserRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  accounts?: Account[];
}

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from 'react';
import {
  login as authLoginService,
  register as authRegisterService,
} from '@/services/auth';
import type {
  User,
  UserLoginPayload,
  UserRegisterPayload,
} from '@/types/authType';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface JwtUserPayload {
  id: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (payload: UserLoginPayload) => Promise<void>;
  register: (payload: UserRegisterPayload) => Promise<void>;
  logout: () => void;
  isLoadingAuth: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode<JwtUserPayload>(storedToken); // Decodifica o token

          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            console.warn('Token expirado. Realizando logout...');
            logout();
            return;
          }

          setToken(storedToken);
          setIsAuthenticated(true);

          setUser({
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
          });
        } catch (error) {
          console.error(
            'Erro ao decodificar ou validar token do localStorage:',
            error,
          );
          logout();
        }
      }
      setIsLoadingAuth(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (payload: UserLoginPayload) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const response = await authLoginService(payload);

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setIsAuthenticated(true);
        setUser(response.user || null);
      } else {
        throw new Error('Token não recebido na resposta do login.');
      }
    } catch (err: any) {
      setAuthError(
        err.response?.data?.message || 'Falha no login. Credenciais inválidas.',
      );
      console.error('Erro de login no contexto:', err);
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const register = useCallback(async (payload: UserRegisterPayload) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      await authRegisterService(payload);
    } catch (err: any) {
      setAuthError(err.response?.data?.message || 'Falha no registro.');
      console.error('Erro de registro no contexto:', err);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.warn('Requisição não autorizada (401). Realizando logout...');
          logout();
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        user,
        login,
        register,
        logout,
        isLoadingAuth,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado com um AuthProvider');
  }
  return context;
};

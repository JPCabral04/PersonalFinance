import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UserLoginPayload } from '@/interfaces/auth';
import { login } from '@/services/auth';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setError(null);
    setSuccessMessage(null);

    setIsLoading(true);
    const payload: UserLoginPayload = {
      email: data.email,
      password: data.password,
    };

    try {
      await login(payload);
      setSuccessMessage(
        'Login bem-sucedido! Você será redirecionado para a página home.',
      );
      reset();

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Falha no login. Verifique os dados ou tente novamente.',
      );
      console.error('Erro de login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-16 xl:px-20">
      <h2 className="text-center text-2xl font-extrabold text-gray-800">
        Seja, Bem Vindo!
      </h2>

      <p className="mt-1 text-center text-sm text-gray-600">
        Acesse o sistema.
      </p>

      {/* Formulário de Login */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="animate-fade-in rounded-md border border-red-200 bg-red-50 px-3 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-secondary-50 border-secondary-200 text-secondary-700 animate-fade-in rounded-md border px-3 py-3 text-center text-sm">
            {successMessage}
          </div>
        )}

        {/* Campos de Input (Email e Senha) */}

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            {...rhfRegister('email', {
              required: 'O email é obrigatório.',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Por favor, insira um email válido.',
              },
            })}
            className={`relative block w-full appearance-none border px-3 py-3 ${
              errors.email ? 'border-red-400' : 'border-gray-300'
            } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-sm ${
              isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
            disabled={isFormDisabled}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            {...rhfRegister('password', {
              required: 'A senha é obrigatória.',
              minLength: {
                value: 8,
                message: 'A senha deve ter pelo menos 8 caracteres.',
              },
            })}
            className={`relative block w-full appearance-none border px-3 py-3 ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-sm ${
              isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
            disabled={isFormDisabled}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Botão de Entrar */}
        <div>
          <button
            type="submit"
            disabled={isFormDisabled || !isValid}
            className={`group relative flex w-full justify-center rounded-md border border-transparent px-4 py-3 text-base font-medium text-white ${
              isFormDisabled || !isValid
                ? 'bg-primary-700/40 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 focus:outline-none'
            } transition duration-200 ease-in-out`}
          >
            {isFormDisabled ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

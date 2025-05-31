import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UserRegisterPayload } from '@/interfaces/auth';
import { register } from '@/services/auth';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    getValues,
  } = useForm<RegisterFormData>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setError(null);
    setSuccessMessage(null);

    if (data.password !== data.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    const payload: UserRegisterPayload = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      await register(payload);
      setSuccessMessage(
        'Registro bem-sucedido! Você será redirecionado para a página de login.',
      );
      reset();

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Falha no registro. Verifique os dados ou tente novamente.',
      );
      console.error('Erro de registro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="w-full px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <h2 className="text-center text-2xl font-extrabold text-gray-800">
        Crie Sua Conta
      </h2>

      <p className="mt-1 text-center text-sm text-gray-600">
        É rápido e fácil.
      </p>

      {/* Formulário de Registro */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="animate-fade-in rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-secondary-50 border-secondary-200 text-secondary-700 animate-fade-in rounded-md border px-3 py-2 text-center text-sm">
            {successMessage}
          </div>
        )}

        {/* Campos de Input (Nome, Email, Senha, Confirmar Senha) */}
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome completo"
            {...rhfRegister('name', { required: 'O nome é obrigatório.' })}
            className={`relative block w-full appearance-none border px-3 py-2 ${
              errors.name ? 'border-red-400' : 'border-gray-300'
            } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none ${
              isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
            disabled={isFormDisabled}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

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
            placeholder="Seu melhor email"
            {...rhfRegister('email', {
              required: 'O email é obrigatório.',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Por favor, insira um email válido.',
              },
            })}
            className={`relative block w-full appearance-none border px-3 py-2 ${
              errors.email ? 'border-red-400' : 'border-gray-300'
            } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none ${
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
            autoComplete="new-password"
            placeholder="Crie uma senha forte"
            {...rhfRegister('password', {
              required: 'A senha é obrigatória.',
              minLength: {
                value: 8,
                message: 'A senha deve ter pelo menos 8 caracteres.',
              },
            })}
            className={`relative block w-full appearance-none border px-3 py-2 ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none ${
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Confirmar Senha
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Confirme sua senha"
            {...rhfRegister('confirmPassword', {
              required: 'A confirmação da senha é obrigatória.',
              validate: (value) =>
                value === getValues('password') || 'As senhas não coincidem.',
            })}
            className={`relative block w-full appearance-none border px-3 py-2 ${
              errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
            } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none ${
              isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
            disabled={isFormDisabled}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Botão de Registro */}
        <div>
          <button
            type="submit"
            disabled={isFormDisabled || !isValid}
            className={`group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white ${
              isFormDisabled || !isValid
                ? 'bg-primary-700/40 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 focus:outline-none'
            } transition duration-200 ease-in-out`}
          >
            {isFormDisabled ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
      {/* Link para Login */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 mt-1 font-medium underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Faça login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;

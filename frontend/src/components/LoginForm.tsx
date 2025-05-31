import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { login, isLoadingAuth, authError } = useAuth();
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
    try {
      await login(data);
      reset();
      navigate('/');
    } catch (err) {
      console.error('Erro de submissão de login:', err);
    }
  };

  const isFormDisabled = isLoadingAuth || isSubmitting;

  return (
    <div className="w-full px-4 py-10 sm:px-8 md:px-12 lg:px-20 xl:px-24">
      <h2 className="text-center text-2xl font-extrabold text-gray-800">
        Seja, Bem Vindo!
      </h2>

      <p className="mt-2 text-center text-sm text-gray-600">
        Acesse o sistema.
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {authError && (
          <div className="animate-fade-in rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {authError}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
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
            className={`relative block w-full appearance-none border px-4 py-3 ${
              errors.email ? 'border-red-400' : 'border-gray-300'
            } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-base ${
              isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
            disabled={isFormDisabled}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
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
            })}
            className={`relative block w-full appearance-none border px-4 py-3 ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-base ${
              isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
            }`}
            disabled={isFormDisabled}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isFormDisabled || !isValid}
            className={`group relative flex w-full justify-center rounded-md border border-transparent px-6 py-3 text-lg font-medium text-white ${
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

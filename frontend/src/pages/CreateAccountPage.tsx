import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createAccount } from '@/services/accounts';
import { useAuth } from '@/context/AuthContext';

import type { AccountType, CreateAccountPayload } from '@/types/accountsType';

interface CreateAccountFormData {
  name: string;
  accountType: AccountType;
  initialBalance: number;
}

const CreateAccountPage: React.FC = () => {
  const { isLoadingAuth, authError, user } = useAuth();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<CreateAccountFormData>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<CreateAccountFormData> = async (formData) => {
    setLocalError(null);
    setSuccessMessage(null);

    if (formData.initialBalance < 0) {
      setLocalError('O saldo inicial não pode ser negativo.');
      return;
    }

    if (!user || !user.id) {
      setLocalError(
        'ID do usuário não disponível. Por favor, tente logar novamente.',
      );
      console.error('Erro: userId não encontrado no contexto de autenticação.');
      return;
    }

    try {
      const payload: CreateAccountPayload = {
        name: formData.name,
        accountType: formData.accountType,
        balance: formData.initialBalance,
        userId: user.id,
      };

      await createAccount(payload);
      setSuccessMessage(
        'Conta criada com sucesso! Você será redirecionado para a página de contas.',
      );
      reset();
      setTimeout(() => {
        navigate('/accounts');
      }, 2000);
    } catch (err: any) {
      setLocalError(
        err.response?.data?.message ||
          'Falha ao criar conta. Verifique os dados ou tente novamente.',
      );
      console.error('Erro ao criar conta:', err);
    }
  };

  const isFormDisabled = isLoadingAuth || isSubmitting;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg rounded-lg bg-white px-4 py-8 sm:px-6 md:px-8 md:shadow-md">
        <h2 className="text-center text-2xl font-extrabold text-gray-800">
          Criar Nova Conta Financeira
        </h2>

        <p className="mt-2 text-center text-sm text-gray-600">
          Preencha os dados para sua nova conta.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {(authError || localError) && (
            <div className="animate-fade-in rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {authError || localError}
            </div>
          )}
          {successMessage && (
            <div className="bg-secondary-50 border-secondary-200 text-secondary-700 animate-fade-in rounded-md border px-4 py-3 text-center text-sm">
              {successMessage}
            </div>
          )}

          {/* Campo Nome da Conta */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nome da Conta
            </label>
            <input
              id="name"
              type="text"
              autoComplete="off"
              placeholder="Ex: Minha Conta Corrente, Minha Poupança"
              {...rhfRegister('name', {
                required: 'O nome da conta é obrigatório.',
              })}
              className={`relative block w-full appearance-none border px-4 py-3 ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-base ${
                isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              disabled={isFormDisabled}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Campo Saldo Inicial */}
          <div>
            <label
              htmlFor="initialBalance"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Saldo Inicial
            </label>
            <input
              id="initialBalance"
              type="number"
              step="0.1"
              placeholder="0.00"
              {...rhfRegister('initialBalance', {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: 'O saldo inicial não pode ser negativo.',
                },
              })}
              className={`relative block w-full appearance-none border px-4 py-3 ${
                errors.initialBalance ? 'border-red-400' : 'border-gray-300'
              } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-base ${
                isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              disabled={isFormDisabled}
            />
            {errors.initialBalance && (
              <p className="mt-2 text-sm text-red-600">
                {errors.initialBalance.message}
              </p>
            )}
          </div>

          {/* Campo Tipo de Conta */}
          <div>
            <label
              htmlFor="accountType"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Tipo de Conta
            </label>
            <select
              id="accountType"
              {...rhfRegister('accountType', {
                required: 'O tipo de conta é obrigatório.',
              })}
              className={`relative block w-full appearance-none border px-4 py-3 ${
                errors.accountType ? 'border-red-400' : 'border-gray-300'
              } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-base ${
                isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              disabled={isFormDisabled}
            >
              <option value="">Selecione um tipo</option>
              {(
                [
                  'Corrente',
                  'Poupança',
                  'Crédito',
                  'Investimento',
                ] as AccountType[]
              ).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.accountType && (
              <p className="mt-2 text-sm text-red-600">
                {errors.accountType.message}
              </p>
            )}
          </div>

          {/* Botão de Criar Conta */}
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
              {isFormDisabled ? 'Criando Conta...' : 'Criar Conta'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/accounts')}
            className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 font-medium underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Voltar para Contas
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;

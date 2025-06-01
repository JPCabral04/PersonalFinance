import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAccounts } from '@/services/accounts';
import { createTransfer } from '@/services/transactions';
import type { Account } from '@/types/accountsType';
import type { TransferPayload } from '@/types/transactionsTypes';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';

interface TransferFormData {
  originAccountId: string;
  destinationAccountId: string;
  amount: number;
  description: string;
}

const CreateTransferPage: React.FC = () => {
  const { isLoadingAuth, authError, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<TransferFormData>({
    mode: 'onChange',
    defaultValues: {
      amount: 0.01,
      description: '',
    },
  });

  useEffect(() => {
    const fetchUserAccounts = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoadingAccounts(false);
        setLocalError(
          'Você precisa estar logado para realizar transferências.',
        );
        return;
      }
      setLoadingAccounts(true);
      setLocalError(null);
      try {
        const userAccounts = await getAccounts(user.id);
        setAccounts(userAccounts);
      } catch (err: any) {
        setLocalError(
          err.response?.data?.message ||
            'Falha ao carregar suas contas. Não é possível realizar transferências.',
        );
        console.error('Erro ao carregar contas para transferência:', err);
      } finally {
        setLoadingAccounts(false);
      }
    };
    fetchUserAccounts();
  }, [isAuthenticated, user?.id]);

  const onSubmit: SubmitHandler<TransferFormData> = async (formData) => {
    setLocalError(null);
    setSuccessMessage(null);

    if (!user || !user.id) {
      setLocalError(
        'ID do usuário não disponível. Por favor, tente logar novamente.',
      );
      console.error('Erro: userId não encontrado no contexto de autenticação.');
      return;
    }

    if (!formData.originAccountId || !formData.destinationAccountId) {
      setLocalError(
        'Contas de origem e destino são obrigatórias para transferência.',
      );
      return;
    }
    if (formData.originAccountId === formData.destinationAccountId) {
      setLocalError('Conta de origem e destino não podem ser as mesmas.');
      return;
    }
    if (formData.amount <= 0) {
      setLocalError('O valor da transferência deve ser maior que zero.');
      return;
    }

    const originAccount = accounts.find(
      (acc) => acc.id === formData.originAccountId,
    );
    if (originAccount && originAccount.balance < formData.amount) {
      setLocalError('Saldo insuficiente na conta de origem.');
      return;
    }

    try {
      const payload: TransferPayload = {
        originAccount: formData.originAccountId,
        destinationAccount: formData.destinationAccountId,
        amount: formData.amount,
        description: formData.description || undefined,
      };

      await createTransfer(payload);
      setSuccessMessage(
        'Transferência realizada com sucesso! Você será redirecionado para a página de transações.',
      );
      reset();
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    } catch (err: any) {
      setLocalError(
        err.response?.data?.message ||
          'Falha ao realizar transferência. Verifique os dados ou tente novamente.',
      );
      console.error('Erro ao criar transferência:', err);
    }
  };

  const isFormDisabled = isLoadingAuth || isSubmitting || loadingAccounts;

  if (isLoadingAuth || loadingAccounts) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <p className="mt-10 text-center text-red-500">
        Não autorizado. Redirecionando para login...
      </p>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 md:px-8">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-md sm:p-8">
          <h2 className="mb-4 text-xl font-extrabold text-gray-800 sm:text-2xl">
            Nenhuma Conta Encontrada
          </h2>
          <p className="mb-6 text-sm text-gray-600 sm:text-base">
            Você precisa ter pelo menos uma conta cadastrada para realizar
            transferências.
          </p>
          <button
            onClick={() => navigate('/createAccount')}
            className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none sm:px-6 sm:py-3 sm:text-base"
          >
            Criar Minha Primeira Conta
          </button>
        </div>
      </div>
    );
  }

  if (accounts.length < 2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 md:px-8">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-md sm:p-8">
          <h2 className="mb-4 text-xl font-extrabold text-gray-800 sm:text-2xl">
            Contas Insuficientes para Transferência
          </h2>
          <p className="mb-6 text-sm text-gray-600 sm:text-base">
            Você precisa ter pelo menos duas contas para realizar uma
            transferência.
          </p>
          <button
            onClick={() => navigate('/createAccount')}
            className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-md transition duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none sm:px-6 sm:py-3 sm:text-base"
          >
            Criar Mais Contas
          </button>
          <button
            onClick={() => navigate('/transactions')}
            className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 mt-4 text-sm font-medium underline focus:ring-2 focus:ring-offset-2 focus:outline-none sm:text-base"
          >
            Voltar para Transações
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 md:px-8">
      <div className="w-full max-w-lg rounded-lg bg-white px-4 py-8 sm:px-6 md:px-8 md:shadow-md">
        <h2 className="mb-4 text-center text-xl font-extrabold text-gray-800 sm:text-2xl">
          Registrar Nova Transferência
        </h2>
        <p className="mt-2 mb-6 text-center text-sm text-gray-600 sm:text-base">
          Preencha os dados da transferência entre suas contas.
        </p>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {(authError || localError) && (
            <div className="animate-fade-in rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-700 sm:px-4 sm:py-3 sm:text-sm">
              {authError || localError}
            </div>
          )}
          {successMessage && (
            <div className="bg-secondary-50 border-secondary-200 text-secondary-700 animate-fade-in rounded-md border px-3 py-2 text-center text-xs sm:px-4 sm:py-3 sm:text-sm">
              {successMessage}
            </div>
          )}
          {/* Campo Conta de Origem */}
          <div>
            <label
              htmlFor="originAccountId"
              className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
            >
              Conta de Origem
            </label>
            <select
              id="originAccountId"
              {...rhfRegister('originAccountId', {
                required: 'A conta de origem é obrigatória.',
              })}
              className={`relative block w-full appearance-none border px-3 py-2.5 text-sm ${
                errors.originAccountId ? 'border-red-400' : 'border-gray-300'
              } focus:ring-primary-500 focus:border-primary-500 rounded-md text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-base ${
                isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              disabled={isFormDisabled}
            >
              <option value="">Selecione a conta de origem</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({formatCurrency(account.balance)})
                </option>
              ))}
            </select>
            {errors.originAccountId && (
              <p className="mt-1.5 text-xs text-red-600 sm:mt-2 sm:text-sm">
                {errors.originAccountId.message}
              </p>
            )}
          </div>
          {/* Campo Conta de Destino */}
          <div>
            <label
              htmlFor="destinationAccountId"
              className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
            >
              Conta de Destino
            </label>
            <select
              id="destinationAccountId"
              {...rhfRegister('destinationAccountId', {
                required: 'A conta de destino é obrigatória.',
              })}
              className={`relative block w-full appearance-none border px-3 py-2.5 text-sm ${
                errors.destinationAccountId
                  ? 'border-red-400'
                  : 'border-gray-300'
              } focus:ring-primary-500 focus:border-primary-500 rounded-md text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-base ${
                isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              disabled={isFormDisabled}
            >
              <option value="">Selecione a conta de destino</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} ({formatCurrency(account.balance)})
                </option>
              ))}
            </select>
            {errors.destinationAccountId && (
              <p className="mt-1.5 text-xs text-red-600 sm:mt-2 sm:text-sm">
                {errors.destinationAccountId.message}
              </p>
            )}
          </div>
          {/* Campo Valor */}
          <div>
            <label
              htmlFor="amount"
              className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
            >
              Valor
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...rhfRegister('amount', {
                required: 'O valor é obrigatório.',
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: 'O valor deve ser maior que zero.',
                },
              })}
              className={`relative block w-full appearance-none border px-3 py-2.5 text-sm ${
                errors.amount ? 'border-red-400' : 'border-gray-300'
              } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-base ${
                isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              disabled={isFormDisabled}
            />
            {errors.amount && (
              <p className="mt-1.5 text-xs text-red-600 sm:mt-2 sm:text-sm">
                {errors.amount.message}
              </p>
            )}
          </div>
          {/* Campo Descrição (Opcional) */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
            >
              Descrição (opcional)
            </label>
            <input
              id="description"
              type="text"
              autoComplete="off"
              placeholder="Ex: Aluguel, Salário, Compra no mercado"
              {...rhfRegister('description')} // Não é obrigatório
              className={`relative block w-full appearance-none border px-3 py-2.5 text-sm ${
                errors.description ? 'border-red-400' : 'border-gray-300'
              } focus:ring-primary-500 focus:border-primary-500 rounded-md text-sm text-gray-900 placeholder-gray-500 transition duration-200 ease-in-out focus:outline-none sm:text-base ${
                isFormDisabled ? 'cursor-not-allowed bg-gray-100' : ''
              }`}
              disabled={isFormDisabled}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-600 sm:mt-2 sm:text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Botão de Registrar Transferência */}
          <div>
            <button
              type="submit"
              disabled={isFormDisabled || !isValid}
              className={`group relative flex w-full justify-center rounded-md border border-transparent px-5 py-2.5 text-base font-medium text-white ${
                // Botão responsivo
                isFormDisabled || !isValid
                  ? 'bg-primary-700/40 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 focus:outline-none'
              } transition duration-200 ease-in-out`}
            >
              {isFormDisabled
                ? 'Realizando Transferência...'
                : 'Realizar Transferência'}
            </button>
          </div>
        </form>
        {/* Link para voltar */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 text-sm font-medium underline focus:ring-2 focus:ring-offset-2 focus:outline-none sm:text-base"
          >
            Voltar para Transações
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTransferPage;

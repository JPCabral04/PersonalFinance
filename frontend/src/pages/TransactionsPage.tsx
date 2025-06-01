// src/pages/TransactionsPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getTransactions } from '@/services/transactions'; // Serviço para buscar as transações
import { getAccounts } from '@/services/accounts'; // NOVO: para buscar as contas do usuário para o filtro
import type {
  Transaction,
  GetTransactionsQueryParams,
} from '@/types/transactionsTypes';
import type { Account } from '@/types/accountsType'; // NOVO: Tipo Account
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';

import HeaderComponent from '@/components/HeaderComponent';

const TransactionsPage: React.FC = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filterAccountId, setFilterAccountId] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);

  const fetchUserAccountsForFilter = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const accounts = await getAccounts(user.id);
      setUserAccounts(accounts);
    } catch (err: any) {
      console.error('Erro ao carregar contas para filtro:', err);
    }
  }, [isAuthenticated, user?.id]);

  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setLoadingTransactions(false);
      setError('Você precisa estar logado para ver as transações.');
      return;
    }

    setLoadingTransactions(true);
    setError(null);

    try {
      const queryParams: GetTransactionsQueryParams = {
        accountId: filterAccountId || undefined,
        dateFrom: filterDateFrom || undefined,
        dateTo: filterDateTo || undefined,
      };

      const fetchedTransactions = await getTransactions(queryParams);
      setTransactions(fetchedTransactions);
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err);
      if (err.response && err.response.status === 404) {
        setTransactions([]);
        setError(null);
      } else {
        setError(
          err.response?.data?.message || 'Falha ao carregar as transações.',
        );
      }
    } finally {
      setLoadingTransactions(false);
    }
  }, [
    isAuthenticated,
    user?.id,
    filterAccountId,
    filterDateFrom,
    filterDateTo,
  ]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchUserAccountsForFilter();
      fetchTransactions();
    } else if (!isLoadingAuth) {
      setLoadingTransactions(false);
      setError('Você precisa estar logado para ver as transações.');
    }
  }, [
    isAuthenticated,
    user?.id,
    isLoadingAuth,
    fetchUserAccountsForFilter,
    fetchTransactions,
  ]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  if (isLoadingAuth || loadingTransactions) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <p className="mt-10 text-center text-red-500">
        Não autorizado. Redirecionando para login...
      </p>
    );
  }

  return (
    <>
      <HeaderComponent />
      <div className="container mx-auto p-4 md:p-6">
        <div className="relative mb-8 flex items-center justify-center">
          <h1 className="mb-0 text-center text-3xl font-extrabold text-gray-800 md:text-4xl">
            Minhas Transações
          </h1>
        </div>

        {error && (
          <div
            className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Filtro por Conta */}
          <div>
            <label
              htmlFor="filterAccountId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Conta:
            </label>
            <select
              id="filterAccountId"
              className="focus:ring-primary-500 w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
              value={filterAccountId}
              onChange={(e) => setFilterAccountId(e.target.value)}
              disabled={userAccounts.length === 0}
            >
              <option value="">Todas as Contas</option>
              {userAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro Data De */}
          <div>
            <label
              htmlFor="filterDateFrom"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Data De:
            </label>
            <input
              id="filterDateFrom"
              type="date"
              className="focus:ring-primary-500 w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>

          {/* Filtro Data Até */}
          <div>
            <label
              htmlFor="filterDateTo"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Data Até:
            </label>
            <input
              id="filterDateTo"
              type="date"
              className="focus:ring-primary-500 w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
        </div>

        {transactions.length === 0 && !loadingTransactions && !error ? (
          <div className="mt-8 text-center text-base text-gray-600 md:text-lg">
            <p>Você ainda não tem nenhuma transação registrada.</p>
            <button
              onClick={() => navigate('/createTransaction')}
              className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 mt-5 rounded-lg px-6 py-3 font-semibold text-white shadow-md transition duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              Registrar Nova Transação
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-lg bg-white p-5 shadow-md transition duration-200 hover:shadow-lg"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
                      {transaction.description || 'Transação sem descrição'}
                    </h2>
                    <span
                      className={`text-lg font-semibold ${
                        transaction.transactionType === 'Débito'
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {transaction.transactionType}
                    </span>
                  </div>

                  <p className="mb-1 text-sm text-gray-600">
                    Data:{' '}
                    <span className="font-medium">
                      {formatDate(transaction.transactionDate)}
                    </span>
                  </p>
                  <p className="mb-1 text-sm text-gray-600">
                    Origem:{' '}
                    <span className="font-medium">
                      {transaction.originAccount?.name || 'N/A'}
                    </span>
                  </p>
                  <p className="mb-1 text-sm text-gray-600">
                    Destino:{' '}
                    <span className="font-medium">
                      {transaction.destinationAccount?.name || 'N/A'}
                    </span>
                  </p>

                  <p
                    className={`text-2xl font-bold ${
                      transaction.transactionType === 'Débito'
                        ? 'text-red-700'
                        : 'text-green-700'
                    }`}
                  >
                    {transaction.transactionType === 'Débito' && '- '}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/createTransaction')}
                className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 rounded-lg px-8 py-3 font-semibold text-white shadow-lg transition duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Registrar Nova Transação
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TransactionsPage;

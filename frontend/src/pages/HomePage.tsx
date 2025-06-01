import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAccounts } from '@/services/accounts';
import { getTransactions } from '@/services/transactions';
import type { Transaction } from '@/types/transactionsTypes';
import LoadingSpinner from '@/components/LoadingSpinner';
import HeaderComponent from '@/components/HeaderComponent';
import { formatCurrency } from '@/utils/formatters';

const HomePage: React.FC = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [numAccounts, setNumAccounts] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const fetchAccountsSummary = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const accounts = await getAccounts(user.id);
      const balanceSum = accounts.reduce(
        (sum, account) => sum + account.balance,
        0,
      );
      setTotalBalance(balanceSum);
      setNumAccounts(accounts.length);
    } catch (err: any) {
      console.error('Erro ao buscar resumo das contas:', err);
      if (err.response && err.response.status === 404) {
        setTotalBalance(0);
        setNumAccounts(0);
      } else {
        setDashboardError(
          err.response?.data?.message || 'Falha ao carregar resumo das contas.',
        );
      }
    }
  }, [isAuthenticated, user?.id]);

  const fetchRecentTransactions = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;
    try {
      const transactions = await getTransactions();
      setRecentTransactions(transactions.slice(0, 5));
    } catch (err: any) {
      console.error('Erro ao buscar transações recentes:', err);
      if (err.response && err.response.status === 404) {
        setRecentTransactions([]);
      } else {
        setDashboardError(
          err.response?.data?.message ||
            'Falha ao carregar transações recentes.',
        );
      }
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoadingDashboard(true);
      setDashboardError(null);
      if (isAuthenticated && user?.id) {
        await Promise.all([fetchAccountsSummary(), fetchRecentTransactions()]);
      } else {
        setDashboardError('Você precisa estar logado para ver o dashboard.');
      }
      setLoadingDashboard(false);
    };

    if (!isLoadingAuth) {
      loadDashboardData();
    }
  }, [
    isAuthenticated,
    user?.id,
    isLoadingAuth,
    fetchAccountsSummary,
    fetchRecentTransactions,
  ]);

  if (isLoadingAuth || loadingDashboard) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <p className="mt-10 text-center text-red-500">
        Você não está autenticado. Redirecionando para login...
      </p>
    );
  }

  return (
    <>
      <HeaderComponent />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="container mx-auto">
          {dashboardError && (
            <div
              className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
              role="alert"
            >
              <strong className="font-bold">Erro no Dashboard!</strong>
              <span className="block sm:inline"> {dashboardError}</span>
            </div>
          )}

          {/* Seção de Boas-Vindas */}
          <div className="neumorphism-card mb-8 rounded-xl bg-white p-6 shadow-md">
            <h1 className="mb-2 text-3xl font-extrabold text-gray-800 md:text-4xl">
              Olá, {user?.name || 'Usuário'}!
            </h1>
            <p className="text-lg text-gray-600">
              Bem-vindo ao seu painel financeiro PersonalFinance.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card de Saldo Total */}
            <div className="neumorphism-card flex flex-col justify-between rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-700">
                Saldo Total
              </h2>
              <p className="text-primary-600 mb-4 text-4xl font-bold">
                {formatCurrency(totalBalance)}
              </p>
              <Link
                to="/accounts"
                className="text-primary-500 self-end text-sm font-medium hover:underline"
              >
                Ver todas as contas &rarr;
              </Link>
            </div>

            {/* Card de Contas Cadastradas */}
            <div className="neumorphism-card flex flex-col justify-between rounded-xl bg-white p-6 shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-700">
                Contas Cadastradas
              </h2>
              <p className="mb-4 text-4xl font-bold text-gray-800">
                {numAccounts}
              </p>
              <Link
                to="/createAccount"
                className="text-primary-500 self-end text-sm font-medium hover:underline"
              >
                Criar nova conta &rarr;
              </Link>
            </div>

            {/* Card de Transações Recentes */}
            <div className="neumorphism-card flex flex-col justify-between rounded-xl bg-white p-6 shadow-md md:col-span-2 lg:col-span-1">
              <h2 className="mb-4 text-xl font-semibold text-gray-700">
                Transações Recentes
              </h2>
              {recentTransactions.length > 0 ? (
                <ul className="mb-4 space-y-3 text-sm">
                  {recentTransactions.map((tx) => (
                    <li
                      key={tx.id}
                      className="flex items-center justify-between text-gray-700"
                    >
                      <span>
                        {tx.description || 'Transação'} (
                        {tx.originAccount?.name || 'N/A'})
                      </span>
                      <span
                        className={`font-semibold ${tx.transactionType === 'Débito' ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {tx.transactionType === 'Débito' && '- '}
                        {formatCurrency(tx.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-4 text-sm text-gray-500">
                  Nenhuma transação recente.
                </p>
              )}
              <Link
                to="/transactions"
                className="text-primary-500 self-end text-sm font-medium hover:underline"
              >
                Ver todas as transações &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Card de Registrar Nova Transação (Crédito/Débito) */}
            <div className="neumorphism-card flex flex-col items-center justify-center rounded-xl bg-white p-6 text-center shadow-md">
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Registrar Transação
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Registre créditos ou débitos em suas contas.
              </p>
              <button
                onClick={() => navigate('/createTransaction')}
                className="bg-primary-500 hover:bg-primary-600 rounded-md px-6 py-2 text-base font-medium text-white shadow-sm transition-colors duration-200"
              >
                Nova Transação
              </button>
            </div>

            {/* Card de Realizar Transferência */}
            <div className="neumorphism-card flex flex-col items-center justify-center rounded-xl bg-white p-6 text-center shadow-md">
              <h3 className="mb-3 text-lg font-semibold text-gray-700">
                Realizar Transferência
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Transfira fundos entre suas contas.
              </p>
              <button
                onClick={() => navigate('/createTransaction')}
                className="bg-primary-500 hover:bg-primary-600 rounded-md px-6 py-2 text-base font-medium text-white shadow-sm transition-colors duration-200"
              >
                Nova Transferência
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

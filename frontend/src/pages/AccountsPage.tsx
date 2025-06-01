import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { deleteAccount, getAccounts } from '@/services/accounts';
import type { Account } from '@/types/accountsType';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';

import EditAccountModal from '@/components/EditAccountModal';
import HeaderComponent from '@/components/HeaderComponent';

const AccountsPage: React.FC = () => {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const fetchAccounts = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setLoadingAccounts(false);
      setError('Você precisa estar logado para ver as contas.');
      return;
    }

    setLoadingAccounts(true);
    setError(null);
    try {
      const userAccounts = await getAccounts(user.id);
      setAccounts(userAccounts);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setAccounts([]);
        setError(null);
      } else {
        setError(err.response?.data?.message || 'Falha ao carregar as contas.');
      }
    } finally {
      setLoadingAccounts(false);
    }
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchAccounts();
    } else if (!isLoadingAuth) {
      setLoadingAccounts(false);
      setError('Você precisa estar logado para ver as contas.');
    }
  }, [isAuthenticated, user?.id, isLoadingAuth, fetchAccounts]);

  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleAccountUpdated = () => {
    fetchAccounts();
    handleCloseEditModal();
  };

  const handleCreateNewAccountClick = () => {
    navigate('/createAccount');
  };

  const handleDeleteAccountClick = async (accountId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta conta?')) {
      return;
    }

    setDeleteLoading(accountId);
    setDeleteError(null);
    try {
      await deleteAccount(accountId);
      fetchAccounts();
    } catch (err: any) {
      console.error('Erro ao excluir conta:', err);
      setDeleteError(err.response?.data?.message || 'Falha ao excluir conta.');
    } finally {
      setDeleteLoading(null);
    }
  };

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

  return (
    <>
      <HeaderComponent />
      <div className="container mx-auto p-4 md:p-6">
        <div className="relative mb-8 flex items-center justify-center">
          <h1 className="mb-0 text-center text-3xl font-extrabold text-gray-800 md:text-4xl">
            Minhas Contas
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

        {deleteError && (
          <div
            className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            <strong className="font-bold">Erro ao Excluir!</strong>
            <span className="block sm:inline"> {deleteError}</span>
          </div>
        )}

        {accounts.length === 0 && !loadingAccounts && !error ? (
          <div className="mt-8 text-center text-base text-gray-600 md:text-lg">
            <p>Você ainda não tem nenhuma conta cadastrada.</p>
            <button
              onClick={handleCreateNewAccountClick}
              className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 mt-5 rounded-lg px-6 py-3 font-semibold text-white shadow-md transition duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              Criar Minha Primeira Conta
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="relative flex flex-col justify-between rounded-lg bg-white p-5 shadow-md transition duration-200 hover:shadow-lg"
                >
                  <button
                    onClick={() => handleDeleteAccountClick(account.id)}
                    className="absolute top-2 right-2 rounded-full p-1 text-red-500 transition-colors duration-200 hover:text-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none"
                    aria-label={`Excluir conta ${account.name}`}
                    disabled={deleteLoading === account.id}
                  >
                    {deleteLoading === account.id ? (
                      <svg
                        className="h-5 w-5 animate-spin text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </button>

                  <div>
                    <h2 className="mb-2 text-xl font-bold text-gray-800 md:text-2xl">
                      {account.name}
                    </h2>
                    <p className="mb-1 text-sm text-gray-600">
                      <span className="font-medium">{account.accountType}</span>
                    </p>
                    <p className="text-lg font-semibold text-gray-800 md:text-xl">
                      Saldo: {formatCurrency(account.balance)}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => handleEditClick(account)}
                      className="rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white shadow-sm transition duration-200 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleCreateNewAccountClick}
                className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 mt-6 rounded-lg px-6 py-3 font-semibold text-white shadow-md transition duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Criar Nova Conta
              </button>
            </div>
          </>
        )}

        {isEditModalOpen && selectedAccount && (
          <EditAccountModal
            account={selectedAccount}
            onClose={handleCloseEditModal}
            onAccountUpdated={handleAccountUpdated}
          />
        )}
      </div>
    </>
  );
};

export default AccountsPage;

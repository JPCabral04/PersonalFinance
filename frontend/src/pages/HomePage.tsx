import React from 'react';
import { useAuth } from '@/context/AuthContext';
import HeaderComponent from '@/components/HeaderComponent';

const HomePage: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();

  return (
    <>
      <HeaderComponent />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="mb-6 text-4xl font-extrabold text-gray-800">
          Bem-vindo à Página Inicial!
        </h1>
        <p className="mb-8 text-center text-lg text-gray-600">
          Você está logado e acessou esta página protegida.
        </p>

        {isAuthenticated && (
          <button
            onClick={logout}
            className="rounded-md bg-red-500 px-6 py-3 font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
          >
            Sair (Logout)
          </button>
        )}

        {!isAuthenticated && (
          <p className="text-center text-red-500">Você não está autenticado.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;

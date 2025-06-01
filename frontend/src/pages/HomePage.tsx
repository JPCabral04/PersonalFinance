import React from 'react';
import { useAuth } from '@/context/AuthContext';
import HeaderComponent from '@/components/HeaderComponent';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <HeaderComponent />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="mb-6 text-4xl font-extrabold text-gray-800">
          Bem-vindo à Página Inicial!
        </h1>

        {!isAuthenticated && (
          <p className="text-center text-red-500">Você não está autenticado.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;

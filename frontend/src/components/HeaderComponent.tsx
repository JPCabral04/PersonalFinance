import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const HeaderComponent: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  // Estado para o menu hambúrguer em telas pequenas (opcional, mas bom para responsividade)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 text-2xl font-bold tracking-tight transition duration-200"
          >
            PersonalFinance
          </Link>
        </div>

        <nav className="hidden flex-grow justify-center space-x-8 md:flex">
          <Link
            to="/"
            className="hover:text-primary-600 font-medium text-gray-700 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/accounts"
            className="hover:text-primary-600 font-medium text-gray-700 transition duration-200"
          >
            Contas
          </Link>
          <Link
            to="/transactions"
            className="hover:text-primary-600 font-medium text-gray-700 transition duration-200"
          >
            Transações
          </Link>
        </nav>
        {/* Botão de Perfil / Logout (Ícone) */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Ícone de Perfil */}
              <Link
                to="/profile"
                className="hover:text-primary-600 rounded-full p-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                aria-label="Ver Perfil"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
              {/* Botão de Logout */}
              <button
                onClick={logout}
                className="hidden rounded-md bg-red-500 px-3 py-1.5 text-sm text-white transition duration-200 hover:bg-red-700 md:block"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-primary-500 hover:bg-primary-600 rounded-md px-3 py-1.5 text-sm text-white transition duration-200"
            >
              Entrar
            </Link>
          )}

          {/* Botão para Menu Mobile */}
          <button
            className="hover:text-primary-600 rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 focus:outline-none md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? (
              // Ícone X
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
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
            ) : (
              // Ícone Hambúrguer
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Menu Mobile (Dropdown)*/}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white py-2 md:hidden">
          <div className="flex flex-col items-start space-y-2 px-4">
            <Link
              to="/"
              className="hover:text-primary-600 block py-1 font-medium text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/accounts"
              className="hover:text-primary-600 block py-1 font-medium text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contas
            </Link>
            <Link
              to="/transactions"
              className="hover:text-primary-600 block py-1 font-medium text-gray-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Transações
            </Link>
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full py-1 text-left font-medium text-red-500 hover:text-red-700"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;

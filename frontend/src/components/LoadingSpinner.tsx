import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div
        className="border-primary-500 h-16 w-16 animate-spin rounded-full border-t-4 border-b-4"
        role="status"
        aria-label="Carregando..."
      >
        <span className="sr-only">Carregando...</span>{' '}
      </div>
    </div>
  );
};

export default LoadingSpinner;

// src/pages/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UpdateUserPayload } from '@/types/userType';
import { updateUser } from '@/services/user';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProfileFormData {
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoadingAuth, logout } = useAuth();
  const navigate = useNavigate();

  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    mode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (formData) => {
    setLocalError(null);
    setSuccessMessage(null);

    if (!isAuthenticated || !user || !user.id) {
      setLocalError(
        'Sua sessão expirou ou o ID do usuário não está disponível. Por favor, faça login novamente.',
      );
      console.error('Erro: Usuário não autenticado ou userId ausente.');
      return;
    }

    try {
      const payload: UpdateUserPayload = {
        name: formData.name,
        email: formData.email,
      };

      const updatedUser = await updateUser(user.id, payload);
      if (updatedUser.email !== user.email) {
        setSuccessMessage(
          'Perfil atualizado. Seu email foi alterado. Por favor, faça login novamente com o novo email.',
        );

        setTimeout(() => {
          logout();
          navigate('/login');
        }, 3000);
      } else {
        setSuccessMessage('Perfil atualizado com sucesso!');
      }
    } catch (err: any) {
      setLocalError(
        err.response?.data?.message ||
          'Falha ao atualizar o perfil. Verifique os dados ou tente novamente.',
      );
      console.error('Erro ao atualizar o perfil:', err);
    }
  };

  if (isLoadingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <p className="mt-10 text-center text-red-500">
        Não autenticado. Redirecionando para login...
      </p>
    );
  }

  if (!user || !user.id) {
    return (
      <p className="mt-10 text-center text-red-500">
        Não foi possível carregar os dados do perfil. Por favor, faça login
        novamente.
      </p>
    );
  }

  const isFormDisabled = isLoadingAuth || isSubmitting;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg rounded-lg bg-white px-4 py-8 sm:px-6 md:px-8 md:shadow-md">
        <h2 className="mb-4 text-center text-2xl font-extrabold text-gray-800">
          Meu Perfil
        </h2>
        <p className="mt-2 mb-6 text-center text-sm text-gray-600">
          Edite suas informações de perfil.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {localError && (
            <div className="animate-fade-in rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
              {localError}
            </div>
          )}
          {successMessage && (
            <div className="bg-secondary-50 border-secondary-200 text-secondary-700 animate-fade-in rounded-md border px-4 py-3 text-center text-sm">
              {successMessage}
            </div>
          )}
          {/* Campo Nome */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              placeholder={user.name}
              {...rhfRegister('name', {
                required: 'O nome é obrigatório.',
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
          {/* Campo Email */}
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
              placeholder={user.email}
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
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Botão de Salvar Alterações */}
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
              {isFormDisabled ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 focus:ring-primary-500 font-medium underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

// src/components/EditAccountModal.tsx

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type {
  Account,
  AccountType,
  UpdateAccountPayload,
} from '@/types/accountsType';
import { updateAccount } from '@/services/accounts';
import { useState } from 'react';

interface EditAccountModalProps {
  account: Account;
  onClose: () => void;
  onAccountUpdated: () => void;
}

interface EditAccountFormData {
  name: string;
  accountType: AccountType;
  balance: number;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  account,
  onClose,
  onAccountUpdated,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register: rhfRegister,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EditAccountFormData>({
    mode: 'onChange',
    defaultValues: {
      name: account.name,
      accountType: account.accountType,
      balance: account.balance,
    },
  });

  const onSubmit: SubmitHandler<EditAccountFormData> = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const payload: UpdateAccountPayload = {
        name: formData.name,
        accountType: formData.accountType,
        balance: formData.balance,
      };
      await updateAccount(account.id, payload);
      onAccountUpdated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao atualizar conta.');
      console.error('Erro ao atualizar conta:', err);
    } finally {
      setLoading(false);
    }
  };

  const isFormDisabled = loading || isSubmitting;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-800">
          Editar Conta: {account.name}
        </h2>

        {error && (
          <div className="animate-fade-in mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo Nome */}
          <div>
            <label
              htmlFor="edit-name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="edit-name"
              type="text"
              {...rhfRegister('name', { required: 'O nome é obrigatório.' })}
              className={`w-full rounded-md border p-2 ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
              disabled={isFormDisabled}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Campo Tipo de Conta */}
          <div>
            <label
              htmlFor="edit-accountType"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Tipo
            </label>
            <select
              id="edit-accountType"
              {...rhfRegister('accountType', {
                required: 'O tipo é obrigatório.',
              })}
              className={`w-full rounded-md border p-2 ${errors.accountType ? 'border-red-400' : 'border-gray-300'}`}
              disabled={isFormDisabled}
            >
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
              <p className="mt-1 text-xs text-red-600">
                {errors.accountType.message}
              </p>
            )}
          </div>

          {/* Campo Saldo */}
          <div>
            <label
              htmlFor="edit-balance"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Saldo
            </label>
            <input
              id="edit-balance"
              type="number"
              step="0.01"
              {...rhfRegister('balance', {
                required: 'O saldo é obrigatório.',
                valueAsNumber: true,
              })}
              className={`w-full rounded-md border p-2 ${errors.balance ? 'border-red-400' : 'border-gray-300'}`}
              disabled={isFormDisabled}
            />
            {errors.balance && (
              <p className="mt-1 text-xs text-red-600">
                {errors.balance.message}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isFormDisabled || !isValid}
              className={`rounded-md px-4 py-2 font-medium text-white ${
                isFormDisabled || !isValid
                  ? 'bg-primary-700/40 cursor-not-allowed'
                  : 'bg-primary-500 hover:bg-primary-600'
              }`}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountModal;

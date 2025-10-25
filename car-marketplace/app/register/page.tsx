'use client';

import { useFormStatus } from 'react-dom';
import { registerUser, RegisterState } from '@/actions/auth.actions';
import { useActionState } from 'react';

const initialState: RegisterState = {
  error: undefined,
  success: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
    >
      {pending ? 'Регистрация...' : 'Зарегистрироваться'}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form action={formAction} className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Создать аккаунт</h2>

        {/* --- Поле Имя --- */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Имя
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-black"
          />
        </div>

        {/* --- Поле Email --- */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-black"
          />
        </div>

        {/* --- Поле Пароль --- */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Пароль
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm text-black"
          />
        </div>

        {/* --- Отображение ошибок --- */}
        {state.error && <p className="text-red-500 text-sm text-center mb-4">{state.error}</p>}

        {/* --- Кнопка отправки --- */}
        <SubmitButton />
      </form>
    </div>
  );
}

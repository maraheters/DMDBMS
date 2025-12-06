'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { loginQuery, registerQuery } from '@/lib/queries/auth.queries';
import { User } from '@/types';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов'),
  email: z.email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов'),
});

export interface RegisterState {
  error?: string;
  success?: boolean;
}

export async function registerUser(prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = RegisterSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.name,
    };
  }

  const { name, email, password } = validatedFields.data;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    const defaultRoleId = 2;

    await registerQuery(name, email, passwordHash, defaultRoleId);

    console.log('successful register');
  } catch (e: any) {
    if (e.code === '23505') {
      return { error: 'Этот email уже зарегистрирован' };
    }
    return { error: 'Произошла ошибка сервера. Попробуйте позже.' };
  }

  redirect('/login');
}

const LoginSchema = z.object({
  email: z.email('Неверный формат email'),
  password: z.string().min(1, 'Пароль не может быть пустым'),
});

export interface LoginState {
  error?: string;
}

export async function loginUser(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = LoginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.name,
    };
  }

  let user: User;
  const { email, password } = validatedFields.data;

  try {
    user = await loginQuery(email);

    console.log(user);

    if (!user) {
      return { error: 'Неверный email или пароль' };
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return { error: 'Неверный email или пароль' };
    }

    const token = jwt.sign(
      {
        userId: user.id,
        roleId: user.role_id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' },
    );

    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
  } catch (e: any) {
    console.error(e);
    return { error: 'Произошла ошибка сервера. Попробуйте позже.' };
  }

  if (user.role_id === 1) {
    redirect('/dashboard');
  } else {
    redirect('/');
  }
}

export async function logoutUser() {
  (await cookies()).delete('session');
  redirect('/login');
}

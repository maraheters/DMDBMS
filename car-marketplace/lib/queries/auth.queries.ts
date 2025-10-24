'use server';

import { User } from '@/types';
import { db } from '../db';

export const loginQuery = async (email: string): Promise<User> => {
  const { rows } = await db.query(`auth/userByEmail.sql`, [email]);

  return rows[0];
};

export const registerQuery = async (
  name: string,
  email: string,
  passwordHash: string,
  defaultRoleId: number,
): Promise<void> => {
  await db.query(`auth/register.sql`, [name, email, passwordHash, defaultRoleId]);
};

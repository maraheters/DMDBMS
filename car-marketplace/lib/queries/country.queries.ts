'use server';

import { Country } from '@/types';
import { db } from '../db';

export const create = async (name: string): Promise<string> => {
  const { rows } = await db.query(`country/create.sql`, [name]);

  console.log(rows);

  return rows[0].id;
};

export const getAll = async (): Promise<Country[]> => {
  const { rows } = await db.query(`country/get-all.sql`);

  console.log(rows);

  return rows;
};

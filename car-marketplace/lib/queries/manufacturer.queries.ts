'use server';

import { Manufacturer } from '@/types';
import { db } from '../db';

export const create = async (name: string, countryId: number): Promise<string> => {
  const { rows } = await db.query(`manufacturer/create.sql`, [name, countryId]);

  console.log(rows);

  return rows[0].id;
};

export const getAll = async (): Promise<Manufacturer[]> => {
  const { rows } = await db.query(`manufacturer/get-all.sql`);

  console.log(rows);

  return rows;
};

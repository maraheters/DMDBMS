'use server';

import { Manufacturer } from '@/types';
import { db } from '../db';

export const getAll = async (): Promise<Manufacturer[]> => {
  const { rows } = await db.query(`manufacturer/get-all.sql`);

  console.log(rows);

  return rows;
};

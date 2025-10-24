'use server';

import { Manufacturer } from '@/types';
import { db } from '../db';

export const getAllByGeneration = async (generationId: number): Promise<Manufacturer[]> => {
  const { rows } = await db.query(`modification/get-all-by-generation.sql`, [generationId]);

  console.log(rows);

  return rows;
};

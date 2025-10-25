'use server';

import { Manufacturer, Modification } from '@/types';
import { db } from '../db';

export const getAllByGeneration = async (generationId: number): Promise<Modification[]> => {
  const { rows } = await db.query(`modification/get-all-by-generation.sql`, [generationId]);

  console.log(rows);

  return rows;
};

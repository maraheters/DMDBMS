'use server';

import { Generation } from '@/types';
import { db } from '../db';

export const create = async (name: string, startYear: number, carModelId: number): Promise<string> => {
  const { rows } = await db.query(`generation/create.sql`, [carModelId]);

  console.log(rows);

  return rows[0].id;
};

export const getAllByCarModel = async (carModelId: number): Promise<Generation[]> => {
  const { rows } = await db.query(`generation/get-all-by-car-model.sql`, [carModelId]);

  console.log(rows);

  return rows;
};

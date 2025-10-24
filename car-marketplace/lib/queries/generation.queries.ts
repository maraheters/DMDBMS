'use server';

import { CarModel } from '@/types';
import { db } from '../db';

export const getAllByCarModel = async (carModelId: number): Promise<CarModel[]> => {
  const { rows } = await db.query(`generation/get-all-by-car-model.sql`, [carModelId]);

  console.log(rows);

  return rows;
};

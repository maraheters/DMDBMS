'use server';

import { CarModel } from '@/types';
import { db } from '../db';

export const getAllByManufacturer = async (manufacturerId: number): Promise<CarModel[]> => {
  const { rows } = await db.query(`car-model/get-all-by-manufacturer.sql`, [manufacturerId]);

  console.log(rows);

  return rows;
};

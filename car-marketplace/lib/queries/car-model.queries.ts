'use server';

import { CarModel } from '@/types';
import { db } from '../db';

export const create = async (name: string, manufacturerId: number): Promise<string> => {
  const { rows } = await db.query(`car-model/create.sql`, [name, manufacturerId]);

  console.log(rows);

  return rows[0].id;
};

export const getAllByManufacturer = async (manufacturerId: number): Promise<CarModel[]> => {
  const { rows } = await db.query(`car-model/get-all-by-manufacturer.sql`, [manufacturerId]);

  console.log(rows);

  return rows;
};

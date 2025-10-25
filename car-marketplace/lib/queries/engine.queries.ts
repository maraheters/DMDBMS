import { Engine } from '@/types';
import { db } from '../db';

interface CreateEngine {
  name: string;
  type: string;
  configuration: string;
  powerKw: number;
  torqueNm: number;
  displacement: number;
}

export const create = async ({
  name,
  type,
  configuration,
  powerKw,
  torqueNm,
  displacement,
}: CreateEngine): Promise<string> => {
  const { rows } = await db.query(`engine/create.sql`, [name, type, configuration, powerKw, torqueNm, displacement]);

  console.log(rows);

  return rows[0].id;
};

export const getAll = async (): Promise<Engine[]> => {
  const { rows } = await db.query(`engine/get-all.sql`);

  console.log(rows);

  return rows;
};

import { db } from '../db';

export const create = async (type: string): Promise<string> => {
  const { rows } = await db.query(`body/create.sql`, [type]);

  console.log(rows);

  return rows[0].id;
};

export const getAll = async (): Promise<Body[]> => {
  const { rows } = await db.query(`body/get-all.sql`);

  console.log(rows);

  return rows;
};

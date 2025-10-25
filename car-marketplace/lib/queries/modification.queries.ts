'use server';

import { Modification } from '@/types';
import { db } from '../db';

interface CreateModification {
  name: string;
  generationId: number;
  engineId: number;
  bodyId: number;
  transmission: {
    type: string;
    gearsNum: number;
  };
}

export const create = async ({
  name,
  generationId,
  engineId,
  bodyId,
  transmission,
}: CreateModification): Promise<string> => {
  const { rows } = await db.query(`modification/create.sql`, [
    name,
    generationId,
    engineId,
    bodyId,
    transmission.type,
    transmission.gearsNum,
  ]);

  console.log(rows);

  return rows[0].id;
};

export const getAllByGeneration = async (generationId: number): Promise<Modification[]> => {
  const { rows } = await db.query(`modification/get-all-by-generation.sql`, [generationId]);

  console.log(rows);

  return rows;
};

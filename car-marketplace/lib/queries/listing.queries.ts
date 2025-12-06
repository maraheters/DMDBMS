'use server';

import { Listing } from '@/types';
import { db } from '../db';

type Filters = {
  manufacturerId?: string | null;
  carModelId?: string | null;
  generationId?: string | null;
  modificationId?: string | null;
  bodyTypeId?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  minMileage?: string | null;
  maxMileage?: string | null;
};

export const getWithFilter = async (
  queryParams: URLSearchParams | Filters | [string, string][] = {},
): Promise<Listing[]> => {
  let params: Filters;

  console.log(queryParams);

  if (queryParams instanceof URLSearchParams) {
    params = Object.fromEntries(queryParams.entries());
  } else if (Array.isArray(queryParams)) {
    params = Object.fromEntries(queryParams);
  } else {
    params = queryParams;
  }
  const {
    manufacturerId,
    carModelId,
    generationId,
    modificationId,
    bodyTypeId,
    minPrice,
    maxPrice,
    minMileage,
    maxMileage,
  } = params;

  console.log('Parsed params object:', params);

  const { rows } = await db.query(`listing/get-filter.sql`, [
    manufacturerId ? parseInt(manufacturerId) : null, // $1
    carModelId ? parseInt(carModelId) : null, // $2
    generationId ? parseInt(generationId) : null, // $3
    modificationId ? parseInt(modificationId) : null, // $4
    bodyTypeId ? parseInt(bodyTypeId) : null, // $5
    minPrice ? parseFloat(minPrice) : null, // $6
    maxPrice ? parseFloat(maxPrice) : null, // $7
    minMileage ? parseFloat(minMileage) : null, // $8
    maxMileage ? parseFloat(maxMileage) : null, // $9
  ]);

  console.log(rows);

  return rows;
};

interface CreateValues {
  title: string;
  description?: string;
  mileage: number;
  price: number;
  userId: number;
  modificationId: number;
  images: {
    url: string;
    order: number;
  }[];
  documents?: {
    url: string;
  }[];
}

export const create = async ({
  title,
  description,
  mileage,
  price,
  userId,
  modificationId,
  images,
  documents,
}: CreateValues): Promise<number> => {
  if (!documents) documents = [];

  const { rows } = await db.query('listing/create.sql', [
    title,
    description || null,
    mileage,
    price,
    userId,
    modificationId,
    JSON.stringify(images),
    JSON.stringify(documents),
  ]);

  return rows[0].id;
};

export const getById = async (id: number): Promise<Listing | null> => {
  const { rows } = await db.query('listing/get-by-id.sql', [id]);
  return rows[0] || null;
};

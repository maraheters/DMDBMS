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

export const create = async (listing: Listing): Promise<number> => {
  const { rows } = await db.query('listing/create.sql', [
    listing.titile,
    listing.description,
    listing.mileage,
    listing.price,
    listing.user_id,
    listing.modification.id,
    JSON.stringify(listing.images),
    JSON.stringify(listing.documents),
  ]);

  return rows[0].id;
};

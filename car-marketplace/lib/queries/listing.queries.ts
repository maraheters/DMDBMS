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

export const getWithFilter = async (queryParams: URLSearchParams | Filters = {}): Promise<Listing[]> => {
  const params: Filters =
    queryParams instanceof URLSearchParams ? Object.fromEntries(queryParams.entries()) : queryParams;

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

  return rows;
};

export const create = async (...params: any): Promise<any> => {};

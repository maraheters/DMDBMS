'use server';

import { minio } from '@/lib/minio';
import { create } from '@/lib/queries/listing.queries';

interface Values {
  title: string;
  modelId: number;
  modificationId: number;
  price: number;
  mileage: number;
  images: File[];
  description?: string;
  documents?: File[];
}

export const submitListing = async ({
  title,
  modelId,
  modificationId,
  price,
  mileage,
  images,
  description,
  documents,
}: Values) => {
  if (images.length === 0) throw new Error('Must provide at least 1 image');

  const imageUrls = await minio.uploadImages(images);
  const docUrls = documents ? await minio.uploadDocuments(documents) : [];

  const listing = {
    title,
    description,
    mileage,
    price,
    userId: 1,
    modificationId,
    images: imageUrls.map((url, idx) => ({ order: idx, url })),
    documents: docUrls.map((url) => ({ url })),
  };

  console.log(listing);

  await create(listing);
};

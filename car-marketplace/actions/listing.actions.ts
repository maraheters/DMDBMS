'use server';

import { minio } from '@/lib/minio';
import { create } from '@/lib/queries/listing.queries';

export const submitListing = async (formData: FormData) => {
  const title = formData.get('title') as string;
  const modificationId = Number(formData.get('modificationId'));
  const price = Number(formData.get('price'));
  const mileage = Number(formData.get('mileage'));
  const description = formData.get('description') as string | null;

  const images = formData.getAll('images') as File[];
  const documents = formData.getAll('documents') as File[];

  if (images.length === 0) throw new Error('Must provide at least 1 image');

  const imageUrls = await minio.uploadImages(images);
  const docUrls = documents.length > 0 ? await minio.uploadDocuments(documents) : [];

  const listing = {
    title,
    description: description ?? undefined,
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

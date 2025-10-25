import { Client } from 'minio';
import path from 'path';
import { v4 } from 'uuid';

const endPoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
const accessKey = process.env.MINIO_ACCESS_KEY || 'admin';
const secretKey = process.env.MINIO_SECRET_KEY || 'admin';
const imagesBucket = process.env.MINIO_IMAGES_BUCKET || 'images';
const documentsBucket = process.env.MINIO_DOCUMENTS_BUCKET || 'documents';

const minioClient = new Client({
  endPoint,
  accessKey,
  secretKey,
  useSSL: false,
});

const uploadFile = async (file: File, bucketName: string): Promise<string> => {
  const objectName = v4() + path.extname(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  await minioClient.putObject(bucketName, objectName, buffer);

  const url = `${endPoint}/${bucketName}/${objectName}`;
  return url;
};

export const minio = {
  uploadImages: async (files: File[]): Promise<string[]> =>
    await Promise.all(files.map((file) => uploadFile(file, imagesBucket))),

  uploadDocuments: async (files: File[]): Promise<string[]> =>
    await Promise.all(files.map((file) => uploadFile(file, documentsBucket))),
};

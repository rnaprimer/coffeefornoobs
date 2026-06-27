import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

// Create S3 client configured for Cloudflare R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Generate a unique storage key based on folder and date
 * Example: products/2026/06/uuid.webp
 */
export function generateStorageKey(folder: string, extension: string): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const uuid = crypto.randomUUID();
  
  return `${folder}/${year}/${month}/${uuid}.${extension.replace('.', '')}`;
}

/**
 * Generate a pre-signed URL for direct browser uploads (if we decide to use them).
 * We will likely do server-side uploads via Server Actions instead to validate everything safely.
 */
export async function generateUploadPresignedUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // URL expires in 15 minutes
  return getSignedUrl(r2Client, command, { expiresIn: 900 });
}

/**
 * Uploads a file buffer directly to R2 from the server
 */
export async function uploadToR2(buffer: Buffer, key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);
  return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Deletes a file from R2
 */
export async function deleteFromR2(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
  return true;
}

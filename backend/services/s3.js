import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
const s3 = new S3Client();

import dotenv from "dotenv";
dotenv.config();

const BUCKET = process.env.BUCKET;

export const uploadLogoTos3 = async ({ file, clubId }) => {
  const key = `logo/${clubId}}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });
  await s3.send(command);
  return { key };
};

export const uploadVideoTos3 = async ({ file, clubId }) => {
  const key = `video/${clubId}}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });
  await s3.send(command);
  return { key };
};

export const uploadFunctionDescription = async ({ file, requestId }) => {
  const key = `roomRequest/${requestId}}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  });
  await s3.send(command);
  return { key };
};

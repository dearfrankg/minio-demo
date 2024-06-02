import * as Minio from "minio";

// Instantiate the MinIO client with the object store service
// endpoint and an authorized user's credentials
// play.min.io is the MinIO public test cluster
export const minioClient = new Minio.Client({
  endPoint: "storage.fresh.mex.com",
  useSSL: true,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
});

export const minioCreateBucket = async ({ bucket }) => {
  const exists = await minioClient.bucketExists(bucket);
  if (exists) {
    console.log(`Bucket ${bucket} exists.`);
  } else {
    await minioClient.makeBucket(bucket, "us-west-1");
    console.log(`Bucket ${bucket} created in "us-west-1`);
  }
};

export const minioUploadFile = async (params) => {
  // overwrite if exists
  const { bucket, destinationObject, sourceFile, metaData } = params;
  await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData);
  const message = `File ${sourceFile} uploaded as object ${destinationObject} in bucket ${bucket}`;
  console.log(message);
};

export const minioGetPresignedUrl = async (params) => {
  const { bucket, destinationObject, timeout } = params;
  return new Promise((resolve, reject) => {
    minioClient.presignedGetObject(
      bucket,
      destinationObject,
      timeout,
      function (err, presignedUrl) {
        if (err) reject(err);
        console.log(presignedUrl);
      }
    );
  });
};

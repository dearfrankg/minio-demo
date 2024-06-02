import * as Minio from "minio";

console.log(process.env.ACCESS_KEY);
console.log(process.env.SECRET_KEY);

// Instantiate the MinIO client with the object store service
// endpoint and an authorized user's credentials
// play.min.io is the MinIO public test cluster
const minioClient = new Minio.Client({
  endPoint: "storage.fresh.mex.com",
  useSSL: true,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
});

// File to upload
const sourceFile = "package.json";

// Destination bucket
const bucket = "js-test-bucket";

// Destination object name
const destinationObject = "my-package.json";

// Check if the bucket exists
// If it doesn't, create it
const exists = await minioClient.bucketExists(bucket);
if (exists) {
  console.log("Bucket " + bucket + " exists.");
} else {
  await minioClient.makeBucket(bucket, "us-west-1");
  console.log("Bucket " + bucket + ' created in "us-west-1".');
}

// Set the object metadata
var metaData = {
  "Content-Type": "text/json",
  "X-Amz-Meta-Testing": 1234,
  example: 5678,
};

// Upload the file with fPutObject
// If an object with the same name exists,
// it is updated with new data
await minioClient.fPutObject(bucket, destinationObject, sourceFile, metaData);
console.log(
  "File " + sourceFile + " uploaded as object " + destinationObject + " in bucket " + bucket
);

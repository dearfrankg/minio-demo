import { minioCreateBucket, minioGetPresignedUrl, minioUploadFile } from "./minio.mjs";

const ONE_DAY = 24 * 60 * 60;

try {
  await minioCreateBucket({ bucket: "js-test-bucket", region: "us-west-1" });

  await minioUploadFile({
    bucket: "js-test-bucket",
    destinationObject: "my-package.json",
    sourceFile: "package.json",
    metaData: {
      "Content-Type": "text/json",
      "X-Amz-Meta-Testing": 1234,
      example: 5678,
    },
  });

  const presignedUrl = await minioGetPresignedUrl({
    bucket: "js-test-bucket",
    destinationObject: "my-package.json",
    timeout: ONE_DAY,
  });
  console.log("presignedUrl: ", presignedUrl);
} catch (e) {
  console.log("e: ", e);
}

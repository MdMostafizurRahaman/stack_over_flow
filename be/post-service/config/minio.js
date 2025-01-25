const Minio = require('minio');
const dotenv = require('dotenv');
dotenv.config();

// Initialize the MinIO client with environment variables
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

// Wrap the callback-based bucketExists method in a Promise for async/await usage
const checkBucketExists = async (bucketName) => {
  return new Promise((resolve, reject) => {
    minioClient.bucketExists(bucketName, (err, exists) => {
      if (err) {
        reject(err);  // Reject the promise in case of error
      } else {
        resolve(exists);  // Resolve with the bucket existence status
      }
    });
  });
};

const createBucketIfNotExists = async () => {
  try {
    const exists = await checkBucketExists(BUCKET_NAME);

    if (!exists) {
      // If the bucket doesn't exist, create it
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      console.log(`Bucket "${BUCKET_NAME}" created successfully.`);
    } else {
      console.log(`Bucket "${BUCKET_NAME}" already exists.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Call the function to check and create the bucket
createBucketIfNotExists();

module.exports = { minioClient, BUCKET_NAME };

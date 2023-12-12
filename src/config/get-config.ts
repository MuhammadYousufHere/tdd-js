import 'dotenv/config'

export default function getConfig() {
  return {
    ALLOW_ORIGIN: process.env.ALLOW_ORIGIN,
    ALLOW_METHODS: process.env.ALLOW_METHODS,
    ALLOW_HEADERS: process.env.ALLOW_HEADERS,
    CONNECTION_STRING: process.env.CONNECTION_STRING,
    CLOUDFRONT_URL: process.env.CLOUDFRONT_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET: process.env.S3_BUCKET,
    S3_ACCESS_ID: process.env.S3_ACCESS_ID,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  }
}

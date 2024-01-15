import 'dotenv/config'

const {
  DB_URL,
  PORT,
  API_GATEWAY_URL,
  DB_TIMEOUT,
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  BASE_PATH,
  JWT_SECRET,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_SECRET,
  S3_BUCKET,
  S3_REGION,
  S3_ACCESS_KEY,
  S3_ACCESS_ID,
  CLOUDFRONT_URL,
} = process.env

export const config = {
  dbUrl: DB_URL!,
  port: PORT!,
  apiGatewatUrl: API_GATEWAY_URL!,
  dbTimeout: DB_TIMEOUT!,
  dbUser: DB_USER!,
  dbName: DB_NAME!,
  dbPassword: DB_PASSWORD!,
  dbPort: DB_PORT!,
  apiBasePath: BASE_PATH!,
  jwtSecret: JWT_SECRET!,
  authCookieName: AUTH_COOKIE_NAME!,
  authCookieSecret: AUTH_COOKIE_SECRET!,
  s3Bucket: S3_BUCKET!,
  s3AccessId: S3_ACCESS_ID!,
  s3AccessKey: S3_ACCESS_KEY!,
  s3Region: S3_REGION!,
  cloudFrontUrl: CLOUDFRONT_URL,
}

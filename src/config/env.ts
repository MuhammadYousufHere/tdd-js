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
}

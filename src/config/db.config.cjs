import { config } from './env'

export default {
  defaultEnv: 'development',
  local: {
    driver: 'mysql',
    multipleStatements: true,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    host: { ENV: 'DB_HOST' },
    user: { ENV: 'DB_USER' },
    password: { ENV: 'DB_PASS' },
    database: { ENV: 'DB_NAME' },
  },
  development: {
    host: config.dbUrl,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: config.dbTimeout,
    },
    logging: false,
  },
  production: {
    host: config.dbUrl,
    username: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: config.dbTimeout,
    },
    logging: false,
  },
  test: {
    host: '127.0.0.1',
    username: 'root',
    password: null,
    database: 'database_test',
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: process.env.DB_TIMEOUT,
    },
    logging: false,
  },
}

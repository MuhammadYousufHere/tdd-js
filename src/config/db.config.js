require('dotenv').config()

const { DB_URL, DB_TIMEOUT, DB_USER, DB_NAME, DB_PASSWORD } = process.env
module.exports = {
  defaultEnv: 'development',

  development: {
    host: DB_URL,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,

    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: DB_TIMEOUT,
    },
    logging: false,
  },
  production: {
    host: DB_URL,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    dialect: 'mysql',
    dialectOptions: {
      connectTimeout: DB_TIMEOUT,
    },
    logging: false,
  },
}

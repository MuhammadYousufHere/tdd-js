import { winstonLogger } from '@/utils/logger'
import { config } from '@config/env'

import { Sequelize } from 'sequelize'
import { Logger } from 'winston'

const log: Logger = winstonLogger('authenticationServer', 'debug')

export const sequelize: Sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword,
  {
    dialect: 'mysql',
    host: config.dbUrl,
    logging: false,
    dialectOptions: {
      multipleStatements: true,
    },
  }
)

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate()
    // await sequelize.sync()
    log.info(
      'AuthService Mysql database connection has been established successfully.'
    )
  } catch (error) {
    log.info('Auth Service - Unable to connect to database.')
    log.error('error', 'AuthService databaseConnection() method error:', error)
  }
}

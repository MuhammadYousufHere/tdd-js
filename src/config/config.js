import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi'

const rootPath = path.resolve(process.cwd(), '.env')
dotenv.config({ path: rootPath })

const envVarSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    LOG_LEVEL: Joi.string()
      .valid('debug', 'error', 'warn', 'info')
      .required()
      .default('debug'),
    PORT: Joi.number().default(9876),
    MONGODB_URI: Joi.string().required().description('Mongo DB URI'),
    CURRENT_DB: Joi.string().required().description('Mongo DB Current DB'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
  })
  .unknown()
const { value: envs, error } = envVarSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}
export default {
  env: envs.NODE_ENV,
  port: envs.PORT,
  logLevel: envs.LOG_LEVEL,
  mongodbURI: envs.MONGODB_URI,
  dbName: envs.CURRENT_DB,
  jwt: { secret: envs.JWT_SECRET },
}

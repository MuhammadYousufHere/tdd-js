import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import router from './root-router'
import path from 'path'
import handleErrors from './middleware/error-middleware'
import loggerMiddleware from './middleware/logger-middleware'
import { AppError } from '@utils/app-error'
import getConfig from './config/get-config'
import * as swaggerDoc from '../swagger.json'
import swagger from 'swagger-ui-express'

/**
 * The ExpressJS app
 */
const app = express()

/**
 * Middlewares
 */
app.enable('trust proxy')

const config = getConfig()

app.use(
  cors({
    origin: config.ALLOW_ORIGIN?.split(',').map((x) => x.trim()),
    methods: config.ALLOW_METHODS?.split(',').map((x) => x.trim()),
    allowedHeaders: config.ALLOW_HEADERS?.split(',').map((x) => x.trim()),
    credentials: true,
  })
)

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
/**
 * Routes and global error handling
 */
app.use(loggerMiddleware())
app.use('/docs', swagger.serve, swagger.setup(swaggerDoc))
app.use(router)
app.use(handleErrors())

// Uncaught exception and SIGTERM handling
process.on('uncaughtException', (err: Error | AppError) => {
  console.error('Uncaught Exception:', err)
  // Perform necessary cleanup or logging
  if (!('isOperational' in err) || err.isOperational === false) {
    process.exit(1)
  }
})

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal')
  // Perform cleanup tasks
  process.exit(0) // Exit with success status code (0)
})

export default app

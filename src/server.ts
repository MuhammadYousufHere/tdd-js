import {
  Application,
  urlencoded,
  json,
  Request,
  Response,
  NextFunction,
} from 'express'
import http from 'http'
import 'express-async-errors'
import hpp from 'hpp'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { Logger } from 'winston'

import { config } from '@config/env'
import { appRoutes } from '@/routes/routes'
import { winstonLogger } from '@utils/logger'
import { CustomError, IErrorResponse } from './utils/errorHandler'

const log: Logger = winstonLogger('authenticationServer', 'debug')

export function start(app: Application): void {
  securityMiddleware(app)
  standardMiddleware(app)
  routesMiddleware(app)
  authErrorHandler(app)
  startServer(app)
}

function standardMiddleware(app: Application): void {
  app.use(compression())
  app.use(json({ limit: '200mb' }))
  app.use(urlencoded({ extended: true, limit: '200mb' }))
  app.use(cookieParser(config.authCookieSecret))
}

function routesMiddleware(app: Application): void {
  appRoutes(app)
}

function securityMiddleware(app: Application) {
  // app.set('trust proxy', 1)
  app.set('trust proxy', true)
  app.disable('etag')
  app.use(hpp())
  app.use(helmet())
  app.use(
    cors({
      origin: config.apiGatewatUrl,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
  )
}
function authErrorHandler(app: Application): void {
  app.use(
    (
      error: IErrorResponse,
      _req: Request,
      res: Response,
      next: NextFunction
    ) => {
      log.log('error', `AuthService ${error.comingFrom}:`, error)
      if (error instanceof CustomError) {
        res.status(error.code).json(error.serializeErrors())
      }
      next()
    }
  )
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app)
    log.info(`Authentication server has started with process id ${process.pid}`)
    httpServer.listen(config.port, () => {
      log.info(`Auth service running on port ${config.port}`)
    })
  } catch (error) {
    log.error('error', 'Auth Service startServer() method error:', error)
  }
}

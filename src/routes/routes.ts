import { Application, Request, Response, NextFunction } from 'express'
import { healthRoutes } from './health'
import { authRoutes } from './auth'
import { config } from '@/config/env'
import { NotFoundError } from '@/utils/errorHandler'

export function appRoutes(app: Application): void {
  app.use('/', healthRoutes())
  app.use(config.apiBasePath, authRoutes())

  // all other routes
  catchAll(app)
}

function catchAll(app: Application) {
  app.all('*', (_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFoundError('This endpoint is not found', 'catchAll()'))
  })
}

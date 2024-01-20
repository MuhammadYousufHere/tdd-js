import { Application, Request, Response, NextFunction } from 'express'
import { healthRoutes } from './health'
import { authRoutes } from './auth'
import { config } from '@/config/env'
import { NotFoundError } from '@/utils/errorHandler'
import { currentUserRoutes } from './currUser'

export function appRoutes(app: Application): void {
  app.use(config.apiBasePath, healthRoutes())
  app.use(config.apiBasePath, authRoutes())
  app.use(config.apiBasePath, currentUserRoutes())

  // all other routes
  catchAll(app)
}

function catchAll(app: Application) {
  app.all('*', (_req: Request, _res: Response, next: NextFunction) => {
    console.log({ path: _req.path })
    console.log({ url: _req.url })
    next(new NotFoundError('This endpoint is not found', 'catchAll()'))
  })
}

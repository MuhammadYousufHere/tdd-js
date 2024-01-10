import { Application } from 'express'
import { healthRoutes } from './health'
import { authRoutes } from './auth'
import { config } from '@/config/env'

export function appRoutes(app: Application): void {
  app.use('/', healthRoutes())
  app.use(config.apiBasePath, authRoutes())
}

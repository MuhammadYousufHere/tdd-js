import express, { Request, Response, NextFunction } from 'express'
import { HttpStatusCode } from '@utils/http-status-code'
import { AppError } from '@utils/app-error'
import { IJsonResponse } from '@utils/json-response'
import userModule from './features/user'
import articleModule from './features/article'

const router = express.Router()

function getSubRoute(version: 'v1' | 'v2', subroute: string): string {
  return `/api/${version}/${subroute}`
}

function ping(req: Request, res: Response<IJsonResponse>) {
  res.json({
    code: 200,
    message: 'API is operational',
    data: null,
  })
}

router.get('/api/ping', ping)
router.use(getSubRoute('v1', 'user'), userModule)
router.use(getSubRoute('v1', 'articles'), articleModule)

router.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(HttpStatusCode.NOT_FOUND, 'Not found'))
})

export default router

import { refreshToken } from '@/controllers/refreshToken'
import { resendEmail } from '@/controllers/verifyEmail'
import express, { Router } from 'express'

const router: Router = express.Router()

export function currentUserRoutes(): Router {
  router.get('/refresh-token', refreshToken)
  router.post('/resend-email', resendEmail)

  return router
}

import { logout } from '@/controllers/logout'
import {
  changePassword,
  forgotPassword,
  resetPassword,
} from '@/controllers/password'
import { read } from '@/controllers/signin'
import { create } from '@/controllers/signup'
import { verifyEmail } from '@/controllers/verifyEmail'
import { authMiddleware } from '@/middleware/auth.middleware'
import express, { Router } from 'express'
import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
})

const router: Router = express.Router()

export function authRoutes(): Router {
  router.post('/signup', upload.single('profilePicture'), create)
  router.post('/signin', read)
  router.put('/forgot-password', forgotPassword)
  router.put('/verify-email/:token', verifyEmail)
  router.put('/reset-password/:token', resetPassword)
  router.put('/change-password', authMiddleware, changePassword)
  router.delete('/logout', authMiddleware, logout)
  return router
}

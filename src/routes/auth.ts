import { read } from '@/controllers/signin'
import { create } from '@/controllers/signup'
import express, { Router } from 'express'
import multer from 'multer'

const upload = multer({ dest: '/uploads' })

const router: Router = express.Router()

export function authRoutes(): Router {
  router.post('/signup', upload.single('profilePicture'), create)
  router.post('/signin', read)
  return router
}

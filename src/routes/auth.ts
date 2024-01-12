import { read } from '@/controllers/signin'
import { create } from '@/controllers/signup'
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
  return router
}

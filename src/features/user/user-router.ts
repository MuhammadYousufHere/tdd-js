import express, { Request, Response } from 'express'
import * as userHandlers from './user-handlers'
import authenticateToken from '../../middleware/auth-middleware'
import { validateBody } from '../../middleware/validator-middleware'
import { userSignInSchema, userSignUpSchema } from './user-validators'
import { IJsonResponse, HttpStatusCode } from '@utils/index'
import multer from 'multer'

const router = express.Router()
const storage = multer.memoryStorage()

const upload = multer({ storage })
router.all('/', (_req: Request, res: Response<IJsonResponse>) => {
  res.json({
    code: HttpStatusCode.OK,
    message: 'User service',
    data: null,
  })
})

router.post(
  '/signup',
  upload.single('image'),
  validateBody(userSignUpSchema),
  userHandlers.signUp()
)
router.post('/signin', validateBody(userSignInSchema), userHandlers.signIn())
router.delete('/signout', authenticateToken(), userHandlers.signOut())

export default router

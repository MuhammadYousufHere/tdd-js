import { IJsonResponse, AppError, HttpStatusCode } from '@utils/index'
import authService from './user-service'
import { NextFunction, Request, Response } from 'express'
import sharp from 'sharp'
import getConfig from '@config/get-config'
import s3Client from '@lib/s3'
import { PutObjectCommand } from '@aws-sdk/client-s3'

const config = getConfig()
const authCookieName = '-dx23el2i9t0e'
const authCookieOptions = {
  httpOnly: true,
  sameSite: false,
  expires: new Date(Date.now() + 31536000000), // 1 day life
  secure: true,
}

// entry
export function signUp() {
  return async (
    req: Request,
    res: Response<IJsonResponse>,
    next: NextFunction
  ) => {
    try {
      const userData = req.body
      let imageKey = ''

      if (req.file) {
        let key = req.file.originalname.split('.')[0]
        const imgBuffer = await sharp(req.file?.buffer)
          .resize({
            height: 1920,
            width: 1080,
            fit: 'contain',
          })
          .toBuffer()
        const params = {
          Bucket: config.S3_BUCKET,
          Key: key,
          Body: imgBuffer,
          ContentType: req.file?.mimetype,
        }
        const command = new PutObjectCommand(params)
        await s3Client.send(command)
        imageKey = key as string
      }
      const [token, user] = await authService.signUp({ ...userData, imageKey })

      return res
        .cookie(authCookieName, token, authCookieOptions)
        .status(HttpStatusCode.CREATED)
        .json({
          code: HttpStatusCode.CREATED,
          message: 'Sign up successful',
          data: user,
        })
    } catch (err) {
      if (err instanceof AppError) {
        next({ code: err.statusCode, message: err.message, data: null })
      }
      next(new AppError(HttpStatusCode.BAD_REQUEST, 'Sign up failed'))
    }
  }
}

export function signIn() {
  return async (
    req: Request,
    res: Response<IJsonResponse>,
    next: NextFunction
  ) => {
    try {
      const userData = req.body
      const [token, user] = await authService.signIn(
        userData.username,
        userData.password
      )
      debugger

      return res.cookie(authCookieName, token, authCookieOptions).json({
        code: HttpStatusCode.OK,
        message: 'Sign in successful',
        data: user,
      })
    } catch (err) {
      next(new AppError(HttpStatusCode.UNAUTHORIZED, 'Sign in failed'))
    }
  }
}

export function signOut() {
  return async (req: Request, res: Response<IJsonResponse>) => {
    return res.clearCookie(authCookieName).json({
      code: HttpStatusCode.OK,
      message: 'Sign out successful',
      data: null,
    })
  }
}

import { config } from '@/config/env'
import { IAuthPayload } from '@/interfaces/auth'
import { BadRequestError, NotAuthorizedError } from '@/utils/errorHandler'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { verify } from 'jsonwebtoken'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    throw new BadRequestError(
      'No Bearer token in the Authorization header. Make sure you authorize your request by providing the HTTP header',
      'authMiddlware()'
    )
  }
  if (!req.signedCookies[config.authCookieName]) {
    throw new NotAuthorizedError(
      'It looks like you are not logged in',
      'from authMiddleware() method'
    )
  }
  try {
    const authHeader = req.headers.authorization.split(' ')
    const token = authHeader[1]
    if (!token) {
      throw new NotAuthorizedError(
        'Not Authenticated',
        'from authMiddleware() method'
      )
    }
    const payload: IAuthPayload = verify(
      token,
      config.jwtSecret!
    ) as IAuthPayload

    if (!payload) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Access token has expired',
        code: 401,
      })
    }
    req.currentUser = payload

    next()
  } catch (error) {
    if (error instanceof NotAuthorizedError) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: error.message, code: error.code })
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong!',
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    })
  }
}

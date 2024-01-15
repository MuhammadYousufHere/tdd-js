import { authCookieOptions } from '@/config/cookie'
import { config } from '@/config/env'
import { IAuthPayload } from '@/interfaces/auth'
import { signToken } from '@/services/auth.service'
import { NotAuthorizedError } from '@/utils/errorHandler'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { verify } from 'jsonwebtoken'

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const prevRefreshToken = req.signedCookies[config.authCookieName]

  if (!prevRefreshToken) {
    throw new NotAuthorizedError(
      'You cannot access this resource.',
      'refreshToken() method'
    )
  }
  try {
    const payload: IAuthPayload = verify(
      prevRefreshToken,
      config.jwtSecret
    ) as IAuthPayload

    if (Date.now() >= payload.exp! * 1000) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Refresh token has expired',
        code: 401,
      })
    }
    const refreshToken = signToken(
      payload.id!,
      payload.email!,
      payload.username,
      '24h'
    )
    const accessToken = signToken(
      payload.id!,
      payload.email!,
      payload.username,
      '24h'
    )

    res
      .cookie(config.authCookieName, refreshToken, authCookieOptions)
      .status(StatusCodes.OK)
      .json({
        code: StatusCodes.OK,
        message: 'Succesfully re-authenticated user',
        data: {
          accessToken,
        },
      })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong',
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    })
  }
}

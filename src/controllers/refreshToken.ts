import { authCookieOptions } from '@/config/cookie'
import { config } from '@/config/env'
import { IAuthPayload } from '@/interfaces/auth'
import { signToken } from '@/services/auth.service'
import { NotAuthorizedError } from '@/utils/errorHandler'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { verify } from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'

export async function refreshToken(req: Request, res: Response): Promise<void> {
  const prevRefreshToken = req.signedCookies[config.authCookieName]

  if (!prevRefreshToken) {
    throw new NotAuthorizedError(
      'It looks like you are not logged in',
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
      return
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
      '1h'
    )
    req.currentUser = {
      id: payload.id!,
      username: payload.username!,
      email: payload.username!,
      iat: jwtDecode(accessToken).iat,
      exp: jwtDecode(accessToken).exp,
    }
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

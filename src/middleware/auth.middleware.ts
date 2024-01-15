import { config } from '@/config/env'
import { IAuthPayload } from '@/interfaces/auth'
import { NotAuthorizedError } from '@/utils/errorHandler'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // verify token
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        throw new NotAuthorizedError(
          'Not Authenticated',
          'from authMiddleware() method'
        )
      }

      //   const payload: IAuthPayload = verify(
      //     token,
      //     config.jwtSecret!
      //   ) as IAuthPayload

      //   req.currentUser = payload
    }

    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid!' })
  }
}

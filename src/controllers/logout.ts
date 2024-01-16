import { config } from '@/config/env'
import { AuthModel } from '@/models/auth'
import { BadRequestError } from '@/utils/errorHandler'
import { winstonLogger } from '@/utils/logger'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Logger } from 'winston'

const log: Logger = winstonLogger('authenticationServer', 'debug')

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    await AuthModel.update(
      {
        loginStatus: 'inactive',
        lastLogin: new Date(),
      },
      { where: { id: req.currentUser?.id } }
    )
    res.clearCookie(config.authCookieName).json({
      message: 'Sign out successful',
      code: StatusCodes.OK,
      data: null,
    })
  } catch (error) {
    if (error instanceof BadRequestError) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message, code: error.code })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        code: StatusCodes.INTERNAL_SERVER_ERROR,
      })
    }
    log.error('from logout()', error)
  }
}

import { emailSchema, resetPasswordSchema } from '@/lib/password.schema'
import { BadRequestError, NotFoundError } from '@/utils/errorHandler'
import { Request, Response } from 'express'
import { Logger } from 'winston'
import { winstonLogger } from '@/utils/logger'
import { StatusCodes } from 'http-status-codes'
import {
  getAuthUserByResetPasswordToken,
  getUserByEmail,
  updateForgotPasswordToken,
} from '@/services/auth.service'
import crypto from 'crypto'

const log: Logger = winstonLogger('authenticationServer', 'debug')

// # reset password email notification
async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { error } = await Promise.resolve(emailSchema.validate(req.body))
    if (error)
      throw new BadRequestError(
        error.details[0].message,
        'from forgotPassowrd() method'
      )
    const user = await getUserByEmail(req.body.email)
    if (!user) {
      throw new NotFoundError(
        'Please provide valid crendentials',
        'forgotPassword() method'
      )
    }
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20))
    const randomCharacters: string = randomBytes.toString('hex')
    const date: Date = new Date()
    date.setHours(date.getHours() + 1)
    updateForgotPasswordToken(user.id!, randomCharacters, date)
    res
      .status(StatusCodes.OK)
      .json({ message: 'Password reset email sent.', code: StatusCodes.OK })
  } catch (error) {
    if (error instanceof BadRequestError || error instanceof NotFoundError) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.message, code: error.code })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Something went wrong',
        code: StatusCodes.INTERNAL_SERVER_ERROR,
      })
    }
    log.error('from read()', error)
  }
}

// # reset password - has random token params
// - should not be old
// - unique
async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const token = req.params.token
    console.log({ token })

    const { error } = await Promise.resolve(
      resetPasswordSchema.validate(req.body)
    )
    if (error) {
      throw new BadRequestError(
        error.details[0].message,
        'passowrd resetPassword() method'
      )
    }
    const user = await getAuthUserByResetPasswordToken(token)
    console.log({ user })
    res.send('reset passowrd')
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
    log.error('from read()', error)
  }
}

// # private - has auth token
async function changePassword(req: Request, res: Response): Promise<void> {
  console.log(req.body)
  res.send('change password')
}

export { forgotPassword, resetPassword, changePassword }

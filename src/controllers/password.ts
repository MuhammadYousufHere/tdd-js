import {
  changePasswordSchema,
  emailSchema,
  resetPasswordSchema,
} from '@/lib/password.schema'
import { BadRequestError, NotFoundError } from '@/utils/errorHandler'
import { Request, Response } from 'express'
import { Logger } from 'winston'
import { winstonLogger } from '@/utils/logger'
import { StatusCodes } from 'http-status-codes'
import {
  getAuthUserByResetPasswordToken,
  getUserByEmail,
  resetForgotPassword,
  updateForgotPasswordToken,
  updatePassword,
} from '@/services/auth.service'
import crypto from 'crypto'
import { AuthModel } from '@/models/auth'
import { Model } from 'sequelize'
import { format, formatISO } from 'date-fns'

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

    // !todo - send the email
    res.status(StatusCodes.OK).json({
      message: 'Password reset email sent',
      code: StatusCodes.OK,
      data: null,
    })
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
  const token = req.params.token
  if (!token) {
    throw new BadRequestError(
      'Reset Password token is not present',
      'resetPassowrd() method'
    )
  }
  try {
    const { password } = req.body
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
    if (!user?.id) {
      throw new BadRequestError(
        'Reset token has expired',
        'Password resetPassword() method error'
      )
    }
    // update password
    const hashedPassword: string =
      await AuthModel.prototype.hashPassword(password)
    await resetForgotPassword(user.id!, hashedPassword)

    res.status(StatusCodes.OK).json({
      message: 'your password was reset successfuly',
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
    log.error('from resetPassword()', error)
  }
}

// # private - has auth token
async function changePassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(
    changePasswordSchema.validate(req.body)
  )

  if (error?.details) {
    throw new BadRequestError(
      error.details[0].message,
      'password changePassword() method'
    )
  }
  try {
    const { oldPassword, newPassword } = req.body

    const currUser: Model = (await AuthModel.findOne({
      where: { id: req.currentUser?.id },
      attributes: ['password'],
    })) as Model

    // # Check for password match
    const passwordsMatch: boolean = await AuthModel.prototype.comparePassword(
      oldPassword,
      currUser?.dataValues?.password
    )
    if (!passwordsMatch) {
      throw new BadRequestError(
        'You have entered an invalid current password',
        'Password changePassword() method error'
      )
    }

    const hashedPassword: string =
      await AuthModel.prototype.hashPassword(newPassword)
    await updatePassword(req.currentUser?.id!, hashedPassword)

    res.status(StatusCodes.OK).json({
      message: 'your password updated successfuly',
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
    log.error('from changePassword()', error)
  }
}

export { forgotPassword, resetPassword, changePassword }

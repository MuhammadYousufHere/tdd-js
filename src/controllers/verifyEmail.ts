import { verifyEmailSchema } from '@/lib/emailVerify.schema'
import {
  emailVerification,
  getUserByEmailVerificationToken,
} from '@/services/auth.service'
import { BadRequestError } from '@/utils/errorHandler'
import { winstonLogger } from '@/utils/logger'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Logger } from 'winston'

const log: Logger = winstonLogger('authenticationServer', 'debug')

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const token = req.params.token

  const { error } = await Promise.resolve(verifyEmailSchema.validate({ token }))
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'verify email() method')
  }
  try {
    const user = await getUserByEmailVerificationToken(token)
    if (!user?.id) {
      throw new BadRequestError(
        'email verification token is either invalid or is already used.',
        'verifyEmail()'
      )
    }
    // invalidate the token & verify user
    await emailVerification(user?.id, token)

    // !todo - redirect to the page
    // res.redirect(
    //   'http://localhost:3000?message=your-account-has-been-verified!&code=200'
    // )
    res.status(StatusCodes.OK).json({
      message: 'your account has been verified!',
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
    log.error('from read()', error)
    console.log(error)
  }
}
export async function resendEmail(req: Request, res: Response): Promise<void> {
  console.log(req)
  console.log(res)
}

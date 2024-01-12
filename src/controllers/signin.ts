import { sequelize } from '@/config/db'
import { config } from '@/config/env'
import { userSignInSchema } from '@/lib/signin'
import { AuthModel } from '@/models/auth'
import { signToken } from '@/services/auth.service'
import { BadRequestError } from '@/utils/errorHandler'
import { isEmail } from '@/utils/helper'
import { winstonLogger } from '@/utils/logger'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { Logger } from 'winston'

const log: Logger = winstonLogger('authenticationServer', 'debug')

const authCookieOptions = {
  httpOnly: true,
  sameSite: false,
  expires: new Date(Date.now() + 86400000), // 1 day life
  secure: true,
}
export async function read(req: Request, res: Response): Promise<void> {
  try {
    const authorization = req.headers['authorization']?.split(' ')[1]

    //   @ts-ignore
    const [username, password] = new Buffer.from(authorization, 'base64')
      .toString()
      .split(':')

    const { error } = await Promise.resolve(
      userSignInSchema.validate({ username, password })
    )
    if (error?.details) {
      throw new BadRequestError(
        error.details[0].message,
        'SignUp create() method error'
      )
    }

    // # check whether it is email or username
    const isValidEmail: boolean = isEmail(username)

    // # Check for user credentials match
    const user = await sequelize.models.auths.findOne({
      where: {
        ...(isValidEmail && { email: username }),
        ...(!isValidEmail && { username }),
      },
    })

    if (!user?.dataValues) {
      throw new BadRequestError(
        'Invalid credentials, incorrect username or password',
        'SignIn read() method error'
      )
    }
    // # Check for password match
    const passwordsMatch: boolean = await AuthModel.prototype.comparePassword(
      password,
      user?.dataValues?.password
    )
    if (!passwordsMatch) {
      throw new BadRequestError(
        'Invalid credentials, incorrect username or password',
        'SignIn read() method error'
      )
    }
    const { id, username: orgUsername, email } = user.dataValues

    // #update metadata
    await AuthModel.update(
      {
        loginStatus: 'active',
      },
      { where: { username: user?.dataValues?.username } }
    )
    // generate accessToken and refreshToken as cookie
    const refreshToken = signToken(id, email, orgUsername, '24h')
    const accessToken = signToken(id, email, orgUsername, '1h')
    res
      .cookie(config.authCookieName, refreshToken, authCookieOptions)
      .status(200)
      .json({
        code: StatusCodes.OK,
        message: 'Authenetication is successful',
        data: { accessToken },
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
  }
}

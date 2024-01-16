import crypto from 'crypto'
import _ from 'lodash'
import { IAuthDocument } from '@/interfaces/auth'
import { signupSchema } from '@/lib/signup'
import { createAuthUser, isNewRecord, signToken } from '@/services/auth.service'
import { BadRequestError } from '@/utils/errorHandler'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { v4 as uuidV4 } from 'uuid'
import { config } from '@/config/env'
import { uploadFileS3 } from '@/lib/uploadfile'
import { Logger } from 'winston'
import { winstonLogger } from '@/utils/logger'
import { firstLetterUppercase } from '@/utils/helper'
import { authCookieOptions } from '@/config/cookie'
import { jwtDecode } from 'jwt-decode'

const log: Logger = winstonLogger('authenticationServer', 'debug')

export async function create(req: Request, res: Response): Promise<void> {
  // # validate the body
  const { error } = await Promise.resolve(signupSchema.validate(req.body))
  if (error?.details) {
    throw new BadRequestError(
      error.details[0].message,
      'SignUp create() method error'
    )
  }
  try {
    const {
      username,
      email,
      password,
      country,
      gender,
      role,
      firstName,
      lastName,
      dateOfBirth,
    } = req.body

    // # check if user registered
    const isExists: boolean | undefined = await isNewRecord(username, email)
    if (isExists) {
      throw new BadRequestError(
        'email or username already taken',
        'SignUp create() method error'
      )
    }
    // # upload the user avatar if exists in body
    const avatar = await uploadFileS3(req.file, username)

    // // # Send account verification email

    // create user in database
    const profilePublicId = uuidV4()
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20))
    const randomCharacters: string = randomBytes.toString('hex')
    const authData: IAuthDocument = {
      username: _.lowerCase(username),
      email,
      loginStatus: 'inactive',
      profilePublicId,
      firstName: firstLetterUppercase(firstName),
      lastName: firstLetterUppercase(lastName),
      dateOfBirth,
      password,
      gender: _.lowerCase(gender),
      country,
      profilePicture: avatar,
      role,
      emailVerificationToken: randomCharacters,
    } as IAuthDocument
    const result: IAuthDocument = (await createAuthUser(
      authData
    )) as IAuthDocument

    // todo - send the email

    const refreshToken = signToken(
      result.id!,
      result.email!,
      result.username!,
      '24h'
    )
    const accessToken = signToken(
      result.id!,
      result.email!,
      result.username!,
      '1h'
    )

    req.currentUser = {
      id: result.id!,
      username: result.username!,
      email: result.username!,
      iat: jwtDecode(accessToken).iat,
      exp: jwtDecode(accessToken).exp,
    }
    res
      .cookie(config.authCookieName, refreshToken, authCookieOptions)
      .status(StatusCodes.CREATED)
      .json({
        code: StatusCodes.CREATED,
        message: 'Sign up successful',
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

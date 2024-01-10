import { IAuthDocument } from '@/interfaces/auth'
import { signupSchema } from '@/schemas/signup'
import { createAuthUser } from '@/services/auth.service'
import { BadRequestError } from '@/utils/errorHandler'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { capitalize } from 'lodash'
import { v4 as uuidV4 } from 'uuid'

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const { error } = await Promise.resolve(signupSchema.validate(req.body))
    if (error?.details) {
      throw new BadRequestError(
        error.details[0].message,
        'SignUp create() method error'
      ).serializeErrors()
    }
    console.log({ error })
    const { username, email, password, country, firstName, lastName } = req.body
    console.log(req.body)
    // # check if user registered

    // # upload the user avatar if exists in body

    // # Send account verification email

    const profilePublicId = uuidV4()

    const authData: IAuthDocument = {
      username: capitalize(username),
      email,
      profilePublicId,
      password,
      country,
      profilePicture: null,
      emailVerificationToken: '',
      firstName,
      lastName,
    } as IAuthDocument
    const result: IAuthDocument = (await createAuthUser(
      authData
    )) as IAuthDocument
    console.log(result)
    res.status(StatusCodes.CREATED).json({
      message: 'create user sucesss',
      status: StatusCodes.CREATED,
      data: result,
    })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error })
  }
  // # Validate the body
}

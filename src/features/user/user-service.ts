import jwt from 'jsonwebtoken'
import getConfig from '../../config/get-config'
import { IUserSchema, UserEntity } from './user-types'
import * as userRepository from './user-repository'
import { AppError } from '@utils/app-error'
import { HttpStatusCode } from '@utils/http-status-code'

const config = getConfig()

async function signUp(userData: IUserSchema): Promise<[string, UserEntity]> {
  const existing = await userRepository.findOneByUsername(userData.username)
  if (existing) {
    throw new AppError(HttpStatusCode.CONFLICT, 'Username already exists')
  }

  const user = await userRepository.createUser(userData)
  const token = await createToken(user.id)

  return [token, user]
}

async function signIn(
  username: string,
  password: string
): Promise<[string, UserEntity]> {
  const user = await userRepository.findOneByPassword(username, password)

  if (!user) {
    throw new Error('Incorrect username or password')
  }
  const { imageKey, ...rest } = user
  const token = await createToken(user.id)

  if (imageKey) {
    return [token, { ...rest, imageUrl: `${config.CLOUDFRONT_URL}${imageKey}` }]
  }
  return [token, user]
}

async function createToken(id: string) {
  if (!config.JWT_SECRET) {
    throw new AppError(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      'Internal server error'
    )
  }

  return jwt.sign({ id }, `${config.JWT_SECRET}`, {
    expiresIn: '7d',
  })
}

export default {
  signIn,
  signUp,
}

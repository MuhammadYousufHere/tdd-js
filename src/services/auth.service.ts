import { Model, Op } from 'sequelize'
import _ from 'lodash'
import { sign } from 'jsonwebtoken'
import { AuthModel } from '@/models/auth'
import { IAuthDocument } from '@/interfaces/auth'
import { winstonLogger } from '@/utils/logger'
import { sequelize } from '@/config/db'
import { config } from '@/config/env'

const logger = winstonLogger('authService', 'debug')

type ExpiresIn = '24h' | '1h'

async function createAuthUser(
  data: IAuthDocument
): Promise<IAuthDocument | undefined> {
  try {
    const result: Model = await AuthModel.create(data)

    const userData: IAuthDocument = _.omit(result.dataValues, [
      'password',
    ]) as IAuthDocument
    return userData
  } catch (error) {
    logger.error('from createAuthUser()', error)
  }
}

async function getUserByUsernameOrEmail(
  username: string,
  email: string
): Promise<IAuthDocument | undefined> {
  try {
    const user = await sequelize.models.auths.findOne({
      where: { username, email },
    })

    return user?.dataValues
  } catch (error) {
    logger.error('from getUserByUsernameOrEmail()', error)
  }
}

async function getUserByEmail(
  email: string
): Promise<IAuthDocument | undefined> {
  try {
    const user = await sequelize.models.auths.findOne({
      where: { email },
    })

    return user?.dataValues
  } catch (error) {
    logger.error('from getUserByUsernameOrEmail()', error)
  }
}
async function getUserById(
  userId: string | number
): Promise<IAuthDocument | undefined> {
  try {
    const user = await sequelize.models.auths.findOne({
      where: { id: userId },
      attributes: {
        exclude: ['password'],
      },
    })

    return user?.dataValues
  } catch (error) {
    logger.error('from getUserByUsernameOrEmail()', error)
  }
}

async function updateForgotPasswordToken(
  userId: string | number,
  passwordResetToken: string,
  passwordResetExpires: Date
): Promise<void> {
  try {
    await AuthModel.update(
      {
        passwordResetToken,
        passwordResetExpires,
      },
      { where: { id: userId } }
    )
  } catch (error) {
    logger.error('from updateForgotPasswordToken()', error)
  }
}

async function getAuthUserByResetPasswordToken(
  token: string
): Promise<IAuthDocument | undefined> {
  try {
    const user: Model = (await AuthModel.findOne({
      where: { passwordResetToken: token },
    })) as Model
    return user.dataValues
  } catch (error) {
    logger.error('from getAuthUserByResetPasswordToken()', error)
  }
}
async function isNewRecord(
  username: string,
  email: string
): Promise<boolean | undefined> {
  try {
    const res = await sequelize.models.auths.findOne({
      where: {
        [Op.or]: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
      limit: 1,
    })
    if (res && res?.dataValues) {
      return true
    }
    return false
  } catch (error) {
    logger.error('from isNewRecord()', error)
  }
}

async function updatePassword(authId: number, password: string): Promise<void> {
  try {
    await AuthModel.update(
      {
        password,
        passwordResetToken: '',
        passwordResetExpires: new Date(),
      },
      { where: { id: authId } }
    )
  } catch (error) {
    logger.error(error)
  }
}

function signToken(
  id: number,
  email: string,
  username: string,
  opt: ExpiresIn
): string {
  return sign(
    {
      id,
      email,
      username,
    },
    config.jwtSecret,
    { expiresIn: opt }
  )
}
export {
  isNewRecord,
  createAuthUser,
  getUserByUsernameOrEmail,
  getUserByEmail,
  signToken,
  updateForgotPasswordToken,
  getAuthUserByResetPasswordToken,
  getUserById,
  updatePassword,
}

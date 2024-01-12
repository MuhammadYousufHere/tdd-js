import { Model, Op } from 'sequelize'
import _ from 'lodash'
import { AuthModel } from '@/models/auth'
import { IAuthDocument } from '@/interfaces/auth'
import { winstonLogger } from '@/utils/logger'
import { sequelize } from '@/config/db'

const logger = winstonLogger('authService', 'debug')

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
export async function isNewRecord(
  username: string,
  email: string
): Promise<boolean | undefined> {
  try {
    const res = await sequelize.models.auths.findAll({
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

    if (res && res[0]?.dataValues === undefined) {
      return false
    }
    return true
  } catch (error) {
    logger.error('from isNewRecord()', error)
  }
}
export { createAuthUser, getUserByUsernameOrEmail }

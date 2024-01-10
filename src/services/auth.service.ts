import { IAuthDocument } from '@/interfaces/auth'
// import { type Model } from 'sequelize'

import _ from 'lodash'
// import { AuthModel } from '@/models/auth.schema'

async function createAuthUser(
  data: IAuthDocument
): Promise<IAuthDocument | undefined> {
  try {
    const userData = data
    // const result: Model = AuthModel.create(data)
    // const userData: IAuthDocument = _.omit(result.dataValues, [
    //   'password',
    // ]) as IAuthDocument
    return userData
  } catch (error) {}
}
async function getUserByUsername() {}
export { createAuthUser, getUserByUsername }

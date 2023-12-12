import User from './user-schema'
import { IUserSchema, SignUpUserData, UserEntity } from './user-types'

export async function findOneByUsername(
  username: string | undefined
): Promise<UserEntity | null> {
  if (!username) return null

  const existing = await User.findOne({
    username: username.toLowerCase(),
  })

  if (!existing) return null

  return new UserEntity(existing)
}

export async function findOneByPassword(
  username: string | undefined,
  password: string | undefined
): Promise<UserEntity | null> {
  if (!username || !password) return null

  const existing = await User.findOne({
    username: username.toLowerCase(),
  })

  if (!existing) return null

  const matching = await existing.comparePassword(password)
  debugger
  if (!matching) return null

  return new UserEntity(existing)
}

export async function createUser(userData: IUserSchema): Promise<UserEntity> {
  const user = new User(userData)
  await user.save()
  return new UserEntity(user)
}

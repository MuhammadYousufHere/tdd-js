import { ObjectId } from 'mongodb'

export interface IUser {
  _id: ObjectId
  username: string
  password: string
  firstName: string
  lastName: string
  imageKey?: string
  imageUrl?: string
  comparePassword: (password: string) => boolean
}

export interface SignUpUserData {
  username: string
  password: string
  firstName: string
  lastName: string
  image?: string | ArrayBuffer | Blob
}
export interface IUserSchema extends Omit<SignUpUserData, 'image'> {
  imageKey?: string
}
/**
 * Represents a Public User with limited information.
 */
export class UserEntity {
  id: string
  username: string
  firstName: string
  lastName: string
  imageKey?: string
  imageUrl?: string
  constructor(user: IUser) {
    this.id = user._id.toString()
    this.username = user.username
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.imageKey = user.imageKey
    this.imageUrl = user.imageUrl
  }
}

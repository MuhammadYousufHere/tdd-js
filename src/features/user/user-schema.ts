import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser } from './user-types'
import { AppError, HttpStatusCode } from '@utils/index'

Schema.Types.String.set('trim', true)

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
    },
    imageKey: {
      type: String,
    },
  },
  { timestamps: true }
)

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password)
}

userSchema.pre('save', function (next) {
  this.username = this.username.toLowerCase()
  next()
})

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    if (!isStrongPassword(this.password))
      throw new AppError(
        HttpStatusCode.BAD_REQUEST,
        'Password should contain at least one uppercase letter, one lowercase letter, one digit, one special character'
      )

    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

export function noBlacklistedChars(params: string) {
  return /\W/.test(params) === false
}
function isStrongPassword(password: string) {
  // Requires at least one uppercase letter, one lowercase letter, one digit, one special character, and a minimum length of 8 characters
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
  return strongPasswordRegex.test(password)
}
const User = model('User', userSchema)

export default User

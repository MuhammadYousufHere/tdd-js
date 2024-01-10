declare global {
  namespace Express {
    interface Request {
      currentUser?: IAuthPayload
    }
  }
}
export interface UserStatus {
  active: 1
  inactive: 0
}

export interface IAuthPayload {
  id: number
  username: string
  email: string
  iat?: number
}

export interface IAuth {
  username?: string
  password?: string
  email?: string
  country?: string
  profilePicture?: string
}

export interface IAuthDocument {
  userId?: number
  username?: string
  firstName?: string
  lastName?: string
  profilePublicId?: string
  gender?: string
  description?: string
  email?: string
  password?: string
  status?: number
  role?: string
  phone?: string
  country?: string
  city?: string
  profilePicture?: string | null
  profileCover?: string | null
  emailVerified?: number
  emailVerificationToken?: string
  loginStatus?: number
  lastLogin?: Date
  createdAt?: Date
  updatedAt?: Date
  passwordResetToken?: string
  passwordResetExpires?: Date
  comparePassword(password: string): Promise<boolean>
  hashPassword(password: string): Promise<string>
}

export interface ISignUpPayload {
  [key: string]: string
  username: string
  password: string
  email: string
  country: string
  profilePicture: string
}

export interface ISignInPayload {
  [key: string]: string
  username: string
  password: string
}

export interface IForgotPassword {
  email: string
}

export interface IResetPassword {
  [key: string]: string
  password: string
  confirmPassword: string
}

export interface IAuthResponse {
  message: string
  status: number
}

export interface IAuthUser {
  profilePublicId: string | null
  country: string | null
  createdAt: Date | null
  email: string | null
  emailVerificationToken: string | null
  emailVerified: boolean | null
  id: number | null
  passwordResetExpires: Date | null
  passwordResetToken: null | null
  profilePicture: string | null
  profileCover: string | null
  updatedAt: Date | null
  username: string | null
}

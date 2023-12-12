import Joi from 'joi'
import { SignUpUserData } from './user-types'

export const userSignInSchema = Joi.object().keys({
  username: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
})

export const userSignUpSchema = Joi.object<SignUpUserData>().keys({
  username: Joi.string().min(3).max(30).alphanum().trim().required(),
  password: Joi.string().min(3).max(30).trim().required(),
  firstName: Joi.string().alphanum().trim().required(),
  lastName: Joi.string().alphanum().trim().required(),
  image: Joi.object({
    data: Joi.binary().required(),
    name: Joi.string().required(),
    type: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
  }),
})

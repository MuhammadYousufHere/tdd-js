import Joi from 'joi'

export const userSignInSchema = Joi.object().keys({
  username: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
})

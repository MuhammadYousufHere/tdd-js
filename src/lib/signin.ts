import Joi from 'joi'

export const userSignInSchema = Joi.object().keys({
  username: Joi.string().trim().required().messages({
    'username.empty': 'username is required',
    'string.base': 'username must be type of string. i.e. iamjohn',
  }),
  password: Joi.string().trim().required().messages({
    'password.empty': 'password is required',
    'string.base': 'Password must be of type string',
  }),
})

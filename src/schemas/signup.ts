import Joi, { ObjectSchema } from 'joi'

export const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().min(3).max(12).required().messages({
    'string.base': 'username must be type of string. i.e. iamjohn',
    'string.min': 'username should not be less than 3 characters',
    'string.max': 'username should not exceed more than 12 characters',
    'string.empty': 'username is a required field',
  }),
  password: Joi.string().min(8).max(15).required().messages({
    'string.base': 'Password must be of type string',
    'string.min': 'password should not be less than 8 characters',
    'string.max': 'password should not exceed more than 15 characters',
    'string.empty': 'Password is a required field',
  }),
  country: Joi.string().required().messages({
    'string.base': 'country must be of type string',
    'string.empty': 'country is a required field',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'email must be of type string',
    'string.email': 'email is not valid',
    'string.empty': 'email is a required field',
  }),
  profilePicture: Joi.string().required().messages({
    'string.base': 'please add a profile picture',
    'string.empty': 'profile picture is required',
  }),
})

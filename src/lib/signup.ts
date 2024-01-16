import Joi, { ObjectSchema } from 'joi'

export const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().min(3).max(12).required().messages({
    'string.base': 'username must be type of string. i.e. iamjohn',
    'string.min': 'username should not be less than 3 characters',
    'string.max': 'username should not exceed more than 12 characters',
    'string.empty': 'username is a required field',
  }),
  firstName: Joi.string().min(3).max(20).required().messages({
    'string.base': 'first name must be type of string',
    'string.min': 'first name should not be less than 3 characters',
    'string.max': 'first name should not exceed more than 20 characters',
    'string.empty': 'first name is a required field',
  }),
  lastName: Joi.string().min(3).max(20).required().messages({
    'string.base': 'last name must be type of string',
    'string.min': 'last name should not be less than 3 characters',
    'string.max': 'last name should not exceed more than 20 characters',
    'string.empty': 'last name is a required field',
  }),
  role: Joi.string()
    .required()
    .valid('professional', 'company', 'institute')
    .messages({
      'string.base': 'role must be type of string. i.e. professional',
      'string.empty': 'role is a required field',
    }),
  password: Joi.string()
    .min(8)
    .max(25)
    .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/)
    .required()
    .messages({
      'string.base': 'Password must be of type string',
      'string.min': 'password should not be less than 8 characters',
      'string.max': 'password should not exceed more than 15 characters',
      'string.empty': 'Password is a required field',
      'string.pattern.base':
        'Password should contain at least one number, one lowercase and uppercase letter and one special character',
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
  dateOfBirth: Joi.date().max('now').iso().messages({
    'date.base': 'dateOfBirth must be a valid date',
    'date.max': 'dateOfBirth cannot be in future',
    'date.empty': 'dateOfBirth is a required field',
  }),
  gender: Joi.string().valid('male', 'female', 'n/a').required().messages({
    'string.base': 'gender must be type of string. i.e. male',
    'string.empty': 'gender is a required field',
  }),
  profilePicture: Joi.object({
    data: Joi.binary().required(),
    size: Joi.number().max(1633365),
    name: Joi.string().required(),
    type: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
  }).messages({
    'string.base': 'please add a profile picture',
    'string.empty': 'profile picture is required',
    'number.max': 'file is too large',
  }),
})

import Joi, { ObjectSchema } from 'joi'

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().email().required().messages({
    'string.base': 'email must be of type string',
    'string.email': 'email is not valid',
    'string.empty': 'email is a required field',
  }),
})
const resetPasswordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string()
    .min(8)
    .max(25)
    .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,15}$/)
    .required()
    .messages({
      'string.base': 'Password must be of type string',
      'string.min': 'password should not be less than 8 characters',
      'string.max': 'password should not exceed more than 15 characters',
      'string.empty': 'Password is a required field',
      'string.pattern.base':
        'Password should contain at least one number, one lowercase and uppercase letter and one special character',
    }),
})
const changePasswordSchema: ObjectSchema = Joi.object().keys({
  newPassword: Joi.string()
    .min(8)
    .max(25)
    .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,15}$/)
    .required()
    .messages({
      'string.base': 'Password must be of type string',
      'string.min': 'password should not be less than 8 characters',
      'string.max': 'password should not exceed more than 15 characters',
      'string.empty': 'Password is a required field',
      'string.pattern.base':
        'Password should contain at least one number, one lowercase and uppercase letter and one special character',
    }),
  oldPassword: Joi.string().required(),
})

export { resetPasswordSchema, changePasswordSchema, emailSchema }

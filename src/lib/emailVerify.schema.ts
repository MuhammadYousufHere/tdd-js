import Joi, { ObjectSchema } from 'joi'

export const verifyEmailSchema: ObjectSchema = Joi.object().keys({
  token: Joi.string().required().messages({
    'string.base': 'verify token must be of type string',
    'string.empty': 'verify token is a required params',
  }),
})

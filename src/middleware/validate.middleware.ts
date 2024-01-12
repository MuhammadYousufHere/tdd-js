import Joi from 'joi'
import { NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, CustomError } from '@/utils/errorHandler'

export const validateBody =
  (schema: Joi.Schema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const { error } = Joi.compile(schema).validate(req.body)

    if (error) {
      const errorMessage = error.details
        .map(details => details.message)
        .join(', ')

      return next(
        new BadRequestError(errorMessage, 'validateBody()').serializeErrors()
      )
    }

    return next()
  }

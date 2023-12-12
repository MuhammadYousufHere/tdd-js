import { Request, Response, NextFunction } from "express";

import Joi from "joi";
import { HttpStatusCode } from "../utils/http-status-code";
import { AppError } from "../utils/app-error";

export const validateBody =
  (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = Joi.compile(schema).validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");

      return next(new AppError(HttpStatusCode.BAD_REQUEST, errorMessage));
    }

    return next();
  };

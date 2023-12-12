import { Request, Response, NextFunction } from "express";
import mapErrors from "../utils/map-errors";
import { HttpStatusCode } from "../utils/http-status-code";
import { AppError } from "../utils/app-error";
import { IJsonResponse } from "../utils/json-response";

const authCookie = "jwt";

// eslint-disable-next-line no-unused-vars
const errorMiddleware =
  () =>
  (
    err: AppError,
    req: Request,
    res: Response<IJsonResponse>,
    next: NextFunction
  ) => {
    const {
      statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
      message = "Something went wrong",
    } = err;

    console.error(`Code: ${statusCode}; Error: ${message}`);

    if (statusCode === HttpStatusCode.FORBIDDEN) {
      res.clearCookie(authCookie);
    }

    res.status(statusCode).json({
      code: statusCode,
      message: message,
      data: null,
    });
  };

export default errorMiddleware;

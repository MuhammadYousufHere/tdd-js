import { HttpStatusCode } from "./http-status-code";

export class AppError extends Error {
  statusCode: HttpStatusCode;
  /**
   * isOperational flag that is set to true by default.
   * It’s used to distinguish between known errors raised by us and other ones that we don’t know how to handle.
   */
  isOperational: boolean;

  constructor(
    statusCode: HttpStatusCode,
    message: string,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

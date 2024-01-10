import { StatusCodes } from 'http-status-codes'

export interface IErrorResponse {
  message: string
  statusCode: number
  comingFrom: string
  serializeErrors(): IError
}

export interface IError {
  message: string
  statusCode: number
  comingFrom: string
}

export abstract class CustomError extends Error {
  abstract statusCode: number
  comingFrom: string

  constructor(message: string, comingFrom: string) {
    super(message)
    this.comingFrom = comingFrom
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      comingFrom: this.comingFrom,
    }
  }
}

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom)
  }
}

export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom)
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom)
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = StatusCodes.REQUEST_TOO_LONG

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom)
  }
}

export class ServerError extends CustomError {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom)
  }
}

export interface ErrnoException extends Error {
  errno?: number
  code?: string
  path?: string
  syscall?: string
  stack?: string
}

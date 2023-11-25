import * as path from 'path'
import { createLogger, transports, format, addColors } from 'winston'
import config from '../config/config.js'

const { combine, printf, errors } = format
const colorizer = format.colorize()
const Root = path.resolve(process.cwd())

const levels = {
  debug: 4,
  info: 3,
  warn: 2,
  error: 1,
}
const colors = {
  info: 'bold cyan',
  debug: 'italic green',
  warn: 'ilalic organge',
  error: 'bold red',
}
addColors(colors)

const logger = createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  levels,
  format: combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ level, message, timestamp, stack }) => {
      const text = `${timestamp} [ ${level.toUpperCase()} ]: ${message}`
      return colorizer.colorize(level, stack ? `${text}\n${stack}` : text)
    }),
    format.json(),
    format.splat(),
    errors({ stack: true }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`
        }),
      ),
      level: config.logLevel,
    }),
    new transports.File({
      filename: path.join(Root, 'server.log'),
      level: config.logLevel,
    }),
    new transports.File({
      filename: path.join(Root, 'server-error.log'),
      level: 'error', // Log only errors to this file
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(Root, 'server-error.log'),
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: path.join(Root, 'server-error.log'),
    }),
  ],
})

export default logger

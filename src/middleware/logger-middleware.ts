import winston from "winston";
import morgan from "morgan";

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: "http",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    json()
  ),
  transports: [new winston.transports.Console()],
});

const loggerMiddleware = () =>
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  });

export default loggerMiddleware;

const { format, createLogger, transports } = require("winston");
const { timestamp, combine, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: "logs.log",
    }),
    new transports.Console(),
  ],
});

module.exports = logger;

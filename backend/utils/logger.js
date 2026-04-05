const winston = require('winston');

const { combine, timestamp, printf, colorize } = winston.format

const consoleFormat = printf(({ level, message, timestamp }) => {
  const time = new Date(timestamp).toLocaleTimeString('en-IN', { hour12: false })
  return `[${time}] ${level.toUpperCase()}: ${message}`
})

const fileFormat = combine(
  timestamp(),
  winston.format.json()
)

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat)
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: fileFormat }),
    new winston.transports.File({ filename: 'logs/combined.log', format: fileFormat })
  ]
});

module.exports = logger;
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

// Add 'http' level so morgan logs are captured (sits between verbose and info)
const customLevels = {
  levels: { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 },
  colors: { error: 'red', warn: 'yellow', info: 'green', http: 'cyan', verbose: 'white', debug: 'blue', silly: 'grey' }
}
winston.addColors(customLevels.colors)

const logger = winston.createLogger({
  levels: customLevels.levels,
  level: 'http',   // capture http + info + warn + error
  transports: [
    new winston.transports.Console({
      format: combine(colorize({ all: true }), timestamp(), consoleFormat)
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error', format: fileFormat }),
    new winston.transports.File({ filename: 'logs/combined.log', format: fileFormat })
  ]
});

module.exports = logger;
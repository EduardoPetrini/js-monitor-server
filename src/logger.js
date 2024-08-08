import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...rest }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), logFormat),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: combine(timestamp(), logFormat),
    }),
  ],
});

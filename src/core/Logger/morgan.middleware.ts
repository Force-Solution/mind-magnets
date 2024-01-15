import morgan, { StreamOptions } from 'morgan';
import { AppLogger } from '@src/core/Logger';

const stream: StreamOptions = {
  write: (message) => AppLogger.info("http:",message)
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);

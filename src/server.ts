import { App } from '@src/app';
import MongooseConnection from './config/dbConnection';
import { db } from './config/configManager';
import { AppLogger } from './core/Logger';
import RedisManager from '@src/config/redisConnection';

const app = new App();

const mongooseConnection = new MongooseConnection({
  mongoUrl: db.url,
  onStartConnection: (mongoUrl) =>
    AppLogger.info('Connecting to MongoDB at', mongoUrl),
  onConnectionError: (error) =>
    AppLogger.error('Error made which trying to make connection', error),
  onConnectionRetry: (mongoUrl) =>
    AppLogger.info('Retrying to MongoDB at', mongoUrl),
});

mongooseConnection.connect((mongoUrl) => {
  AppLogger.info('Connection made with: ', mongoUrl);
});
const redisConnection = new RedisManager();
redisConnection.getClient().on('connect', () => {
  AppLogger.info('Connection made with Redis', 'done');
});

app.run();

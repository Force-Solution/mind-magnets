import Redis, { Redis as RedisClient } from 'ioredis';
import { redisConfig } from '@src/config/configManager';
import { AppLogger } from '@src/core/Logger';

export default class RedisManager {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(redisConfig);

    this.client.on('error', (err) => {
      AppLogger.info('Error connecting to Redis:', err.message);
    });
  }

  public getClient(): RedisClient {
    return this.client;
  }

  public closeConnection(): void {
    this.client.quit();
  }
}

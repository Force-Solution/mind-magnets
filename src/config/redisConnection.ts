import Redis, { Redis as RedisClient } from 'ioredis';
import { redisConfig } from '@src/config/configManager';

export default class RedisManager {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(redisConfig);

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('error', (err) => {
      console.error('Error connecting to Redis:', err);
    });
  }

  public getClient(): RedisClient {
    return this.client;
  }

  public closeConnection(): void {
    this.client.quit();
  }
}
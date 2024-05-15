import { inject, injectable } from 'inversify';
import { DatabaseClient, Logger } from '../index.js';
import * as Mongoose from 'mongoose';
import { Component } from '../../types/component.enum.js';
import { DatabaseSetting } from '../../const.js';
import { setTimeout } from 'node:timers/promises';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      this.logger.info('Already connected to MongoDB client');
    }

    let attempt = 0;
    while (attempt <= DatabaseSetting.RETRY_COUNT) {
      try {
        this.logger.info(`Trying to connect to MongoDB. Attempt ${attempt}`);
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Connection to MongoDb established');
        return;
      } catch(error) {
        ++attempt;
        this.logger.error('Failed to connect to database', error as Error);
        await setTimeout(DatabaseSetting.RETRY_TIMEOUT);
      }
    }

    throw new Error(`Unable to establish database connection after ${DatabaseSetting.RETRY_COUNT}`);
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      this.logger.info('Not connected to MongoDB');
    }

    await Mongoose.disconnect?.();
    this.isConnected = false;

    this.logger.info('Successfully disconnected from MongoDb');
  }

}

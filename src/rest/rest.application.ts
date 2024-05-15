import { RestSchema, Logger, Config, DatabaseClient } from '../shared/libs/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/index.js';
import { getMongoURI } from '../shared/helpers/database.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient
  ) {}

  private async initDB() {
    const mongoURI = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    this.databaseClient.connect(mongoURI);
  }

  public init() {
    this.logger.info('Application initialization');
    this.logger.info(`PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database ...');
    this.initDB();
    this.logger.info('Init database completed');
  }
}

import { RestSchema, Logger, Config, DatabaseClient } from '../shared/libs/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/index.js';
import { getMongoURI } from '../shared/helpers/database.js';
import express, { Express } from 'express';
import { Controller, ExceptionFilter } from './index.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller
  ) {
    this.server = express();
  }

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

  private async initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async initMiddleware() {
    this.server.use(express.json());
    this.server.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
  }

  private async initExceptionFilters() {
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  private async initControllers() {
    this.server.use('/', this.userController.router);
    this.server.use('/', this.offerController.router);
    this.server.use('/', this.commentController.router);
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database ...');
    await this.initDB();
    this.logger.info('Init database completed');

    this.logger.info('Init app-level middlewares ...');
    await this.initMiddleware();
    this.logger.info('Middleware initialization completed');

    this.logger.info('Init controllers ...');
    await this.initControllers();
    this.logger.info('Controllers initialization completed');

    this.logger.info('Init exception filters ...');
    await this.initExceptionFilters();
    this.logger.info('Exception filters initialization completed');

    this.logger.info('Try to init server ...');
    await this.initServer();
    this.logger.info(`Server started on http:localhost:${this.config.get('PORT')}`);


  }
}

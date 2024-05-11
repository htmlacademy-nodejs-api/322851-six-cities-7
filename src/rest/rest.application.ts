import { RestSchema, Logger, Config } from '../shared/libs/index.js';
import { injectable, inject } from 'inversify';
import { Component } from '../shared/types/index.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  public init() {
    this.logger.info('Application initialization');
    this.logger.info(`PORT: ${this.config.get('PORT')}`);
  }
}

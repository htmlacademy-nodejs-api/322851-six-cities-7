import { RestSchema, Logger, Config } from '../shared/libs/index.js';


export class RestApplication {
  constructor(
    private readonly logger: Logger,
    private readonly config: Config<RestSchema>
  ) {}

  public init() {
    this.logger.info('Application initialization');
    this.logger.info(`PORT: ${this.config.get('PORT')}`);
  }
}

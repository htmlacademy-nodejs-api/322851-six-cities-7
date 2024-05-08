import { PinoLogger, RestConfig } from './shared/libs/index.js';
import { RestApplication } from './rest/rest.application.js';


async function bootstrap() {
  const logger = new PinoLogger();
  const config = new RestConfig(logger);
  const application = new RestApplication(logger, config);

  application.init();
}

bootstrap();

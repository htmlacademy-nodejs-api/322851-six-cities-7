import { PinoLogger } from './shared/libs/index.js';
import { RestApplication } from './rest/rest.application.js';


async function bootstrap() {
  const logger = new PinoLogger();
  const application = new RestApplication(logger);

  application.init();
}

bootstrap();

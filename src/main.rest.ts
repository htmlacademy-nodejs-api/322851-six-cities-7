import { Container } from 'inversify';
import 'reflect-metadata';
import { PinoLogger, RestConfig, Logger, Config, RestSchema } from './shared/libs/index.js';
import { RestApplication } from './rest/rest.application.js';
import { Component } from './shared/types/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  const application = container.get<RestApplication>(Component.RestApplication);

  await application.init();
}

bootstrap();

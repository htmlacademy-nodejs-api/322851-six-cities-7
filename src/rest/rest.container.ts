import { Container } from 'inversify';
import { RestApplication } from './index.js';
import { Component } from '../shared/types/index.js';
import {
  Config,
  DatabaseClient,
  Logger, MongoDatabaseClient,
  PinoLogger,
  RestConfig,
  RestSchema
} from '../shared/libs/index.js';

export function createRestApplicationContainer() {
  const restApplicationContainer = new Container();

  restApplicationContainer.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  restApplicationContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  restApplicationContainer.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  restApplicationContainer.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  return restApplicationContainer;
}

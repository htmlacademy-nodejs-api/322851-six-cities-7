import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/rest.application.js';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createCityContainer } from './shared/modules/city/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';

async function bootstrap() {
  const container = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createCityContainer(),
    createOfferContainer(),
    createCommentContainer()
  );

  const application = container.get<RestApplication>(Component.RestApplication);

  await application.init();
}

bootstrap();

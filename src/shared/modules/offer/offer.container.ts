import { Container } from 'inversify';
import { Logger, PinoLogger } from '../../libs/index.js';
import { Component } from '../../types/index.js';
import { types } from '@typegoose/typegoose';
import { OfferEntity, OfferModel } from './offer.entity.js';


export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

  return offerContainer;
}

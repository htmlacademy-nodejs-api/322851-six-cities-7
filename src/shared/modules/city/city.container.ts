import { Container } from 'inversify';
import { CityService, DefaultCityService, CityEntity, CityModel, CityController } from './index.js';
import { Component } from '../../types/index.js';
import { types } from '@typegoose/typegoose';


export function createCityContainer() {
  const cityContainer = new Container();

  cityContainer.bind<CityService>(Component.CityService).to(DefaultCityService).inSingletonScope();
  cityContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);
  cityContainer.bind<CityController>(Component.CityController).to(CityController).inSingletonScope();

  return cityContainer;
}

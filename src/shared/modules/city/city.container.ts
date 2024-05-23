import { Container } from 'inversify';
import { CityService, DefaultCityService, CityEntity, CityModel } from './index.js';
import { Component } from '../../types/index.js';
import { types } from '@typegoose/typegoose';


export function createCityContainer() {
  const cityContainer = new Container();

  cityContainer.bind<CityService>(Component.CityService).to(DefaultCityService).inSingletonScope();
  cityContainer.bind<types.ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);

  return cityContainer;
}

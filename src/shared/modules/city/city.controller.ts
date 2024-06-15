import { inject, injectable } from 'inversify';
import {
  BaseController } from '../../../rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/index.js';
import { CityService } from './city-service.interface.js';
import { SixCities } from '../../const.js';
import { CreateCityDto } from './dto/create-city.dto.js';

@injectable()
export class CityController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CityService) private readonly cityService: CityService
  ) {
    super(logger);

    this.logger.info('Add Six cities to DB');
    Object.values(SixCities).forEach(async (city: CreateCityDto) => {
      await this.cityService.findOrCreate(city);
    });
  }

}

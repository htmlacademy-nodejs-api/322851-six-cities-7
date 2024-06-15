import { inject, injectable } from 'inversify';
import { CityEntity, CityService, CreateCityDto } from './index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/index.js';
import { types } from '@typegoose/typegoose';

@injectable()
export class DefaultCityService implements CityService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CityModel) private readonly cityModel: types.ModelType<CityEntity>
  ) {}

  public async create(dto: CreateCityDto): Promise<types.DocumentType<CityEntity>> {
    const newCity = await this.cityModel.create(dto);
    this.logger.info(`Created new city:  ${newCity.name}`);

    return newCity;
  }

  public async findById(id: string): Promise<types.DocumentType<CityEntity> | null> {
    return this.cityModel.findById(id).exec();
  }

  public async findByName(name: string): Promise<types.DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({ name: name }).exec();
  }

  public async findOrCreate(dto: CreateCityDto): Promise<types.DocumentType<CityEntity>> {
    let city = await this.findByName(dto.name);

    if (!city) {
      this.logger.info('Create new city');
      city = await this.create(dto);
    }

    this.logger.info(`City ${dto.name} already exist`);
    return city;
  }
}

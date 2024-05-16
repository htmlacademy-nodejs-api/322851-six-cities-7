import { DocumentType } from '@typegoose/typegoose';
import { CityEntity, CreateCityDto } from './index.js';

export interface CityService {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findByName(name:string): Promise<DocumentType<CityEntity> | null>;
  findById(id: string): Promise<DocumentType<CityEntity> | null>;
  findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
}

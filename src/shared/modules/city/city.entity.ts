import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CityEntity extends defaultClasses.Base {}
@modelOptions({
  schemaOptions: {
    collection: 'cities',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({ required: true, unique: true })
    name: string;

  @prop({ required: true })
    cityLatitude: number;

  @prop({ required: true })
    cityLongitude: number;

  @prop({ required: true })
    cityZoom: number;
}

export const CityModel = getModelForClass(CityEntity);

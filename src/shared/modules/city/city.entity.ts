import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City } from '../../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CityEntity extends defaultClasses.Base {}
@modelOptions({
  schemaOptions: {
    collection: 'cities',
    timestamps: true,
    id: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CityEntity extends defaultClasses.TimeStamps implements City {
  @prop({ required: true, unique: true })
  public name: string;

  @prop({ required: true })
  public latitude: number;

  @prop({ required: true })
  public longitude: number;

  @prop({ required: true })
  public zoom: number;
}

export const CityModel = getModelForClass(CityEntity);

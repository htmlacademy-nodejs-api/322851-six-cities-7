import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { City, Location } from '../../types/index.js';
import { Types } from 'mongoose';

@modelOptions({
  schemaOptions: {
    collection: 'cities',
    timestamps: true
  }
})
export class CityEntity extends defaultClasses.TimeStamps implements City, defaultClasses.Base {
  @prop({ required: true })
    name: string;

  @prop({ required: true })
    location: Location;

  @prop({ })
  public id: string;

   @prop({ })
  public _id: Types.ObjectId;
}

export const CityModel = getModelForClass(CityEntity);

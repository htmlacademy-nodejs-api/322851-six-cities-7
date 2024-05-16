import { ModelOptions, Ref, defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';
import { Location } from '../../types/index.js';
import { Types } from 'mongoose';
import { CityEntity } from '../city/index.js';
import { UserEntity } from '../user/index.js';


@ModelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
export class OfferEntity extends defaultClasses.TimeStamps implements defaultClasses.Base {
  @prop({required: true})
  public id: string;

  @prop({required: true})
  public _id: Types.ObjectId;

  @prop({required: true, trim: true})
  public title: string;

  @prop({required: true, trim: true})
  public description: string;

  @prop({required: true})
  public date: string;

  @prop({required: true, ref: CityEntity, _id: false})
  public city: Ref<CityEntity>;

  @prop({required: true, trim: true})
  public previewImage: string;

  @prop({required: true})
  public images: string[];

  @prop({required: true})
  public isFavorite: boolean;

  @prop({required: true})
  public isPremium: boolean;

  @prop({required: true})
  public rating: number;

  @prop({required: true})
  public bedrooms: number;

  @prop({required: true})
  public maxAdults: number;

  @prop({required: true, ref: UserEntity})
  public host: Ref<UserEntity>;

  @prop({required: true, trim: true})
  public type: string;

  @prop({required: true})
  public price: number;

  @prop({required: true})
  public goods: string[];

  @prop({required: true})
  public location: Location;

  @prop({required: true})
  public comments: number;
}

export const OfferModel = getModelForClass(OfferEntity);

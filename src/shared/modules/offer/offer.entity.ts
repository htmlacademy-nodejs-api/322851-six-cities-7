import { ModelOptions, Ref, defaultClasses, getModelForClass, prop } from '@typegoose/typegoose';
import { CityEntity } from '../city/index.js';
import { UserEntity } from '../user/index.js';
@ModelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
    _id: true
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
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

  @prop({required: true, type: () => String})
  public images: string[];

  @prop({required: true, default: false})
  public isFavorite: boolean;

  @prop({required: true, default: false})
  public isPremium: boolean;

  @prop({required: true, default: 0})
  public rating: number;

  @prop({required: true})
  public bedrooms: number;

  @prop({required: true})
  public maxAdults: number;

  @prop({required: true, ref: UserEntity, _id: false})
  public host: Ref<UserEntity>;

  @prop({required: true, trim: true})
  public type: string;

  @prop({required: true})
  public price: number;

  @prop({required: true, type: () => String})
  public goods: string[];

  @prop({required: true})
  public offerLongitude: number;

  @prop({required: true})
  public offerLatitude: number;

  @prop({required: true, default: 8})
  public offerZoom: number;

  @prop({required: true, default: 0})
  public comments: number;
}

export const OfferModel = getModelForClass(OfferEntity);

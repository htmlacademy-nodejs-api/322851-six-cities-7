import { Expose } from 'class-transformer';
import { ShortOfferRdo } from './short-offer.rdo.js';
import { User } from '../../../types/user.type.js';

export class DetailedOfferRdo extends ShortOfferRdo {
  @Expose()
  public description: string;

  @Expose()
  public images: string[];

  @Expose()
  public bedrooms: number;

  @Expose()
  public maxAdults: number;

  @Expose()
  public host: User;

  @Expose()
  public goods: string[];
}

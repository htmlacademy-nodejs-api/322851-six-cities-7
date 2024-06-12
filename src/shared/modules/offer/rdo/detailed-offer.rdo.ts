import { Expose, Type } from 'class-transformer';
import { ShortOfferRdo } from './short-offer.rdo.js';
import { UserRdo } from '../../user/index.js';

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
  @Type(() =>UserRdo)
  public host: UserRdo;

  @Expose()
  public goods: string[];
}

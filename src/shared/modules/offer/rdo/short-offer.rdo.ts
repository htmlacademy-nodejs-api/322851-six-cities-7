import { Expose, Type } from 'class-transformer';
import { CityRdo } from '../../city/rdo/city.rdo.js';

export class ShortOfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public price: number;

  @Expose()
  public title: string;

  @Expose()
  public type: string;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  @Type(() => CityRdo)
  public city: CityRdo;

  @Expose()
  public date: string;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: string;

  @Expose()
  public comments: string;

  @Expose()
  public offerLatitude: number;

  @Expose()
  public offerLongitude: number;

  @Expose()
  public offerZoom: number;
}

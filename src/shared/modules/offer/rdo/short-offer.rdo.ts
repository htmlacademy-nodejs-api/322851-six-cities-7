import { Expose } from 'class-transformer';
import { City } from '../../../types/index.js';

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
  public city: City;

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

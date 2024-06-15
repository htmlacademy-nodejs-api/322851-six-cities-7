import { CityDto } from './city.dto';

export class ShortOfferDto {
  public id!: string;

  public price!: number;

  public title!: string;

  public type!: string;

  public isFavorite!: boolean;

  public city!: CityDto;

  public date!: string;

  public previewImage!: string;

  public isPremium!: boolean;

  public rating!: string;

  public comments!: string;

  public offerLatitude!: number;

  public offerLongitude!: number;

  public offerZoom!: number;
}

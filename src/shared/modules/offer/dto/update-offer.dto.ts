export class UpdateOfferDto {

  public title?: string;

  public description?: string;

  public date?: string;

  public city?: string;

  public previewImage?: string;

  public images?: string[];

  public isFavorite?: boolean;

  public rating?: number;

  public bedrooms?: number;

  public maxAdults?: number;

  public type?: string;

  public price?: number;

  public goods?: string[];

  public offerLatitude?: number;

  public offerLongitude?: number;

  public offerZoom?: number;
}

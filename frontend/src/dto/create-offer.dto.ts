
export class CreateOfferDto {
  public title?: string;
  public description?: string;
  public date?: string;
  public city?: string;
  public isPremium?: boolean;
  public bedrooms?: number;
  public maxAdults?: number;
  public type?: string;
  public price?: number;
  public goods?: string[];
  public offerLatitude?: number;
  public offerLongitude?: number;
  public images?: string[];
  public previewImage?: string;
}

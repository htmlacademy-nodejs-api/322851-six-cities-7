import { City, Location, User } from '../../../types/index.js';

export class CreateOfferDto {

  public id: string;

  public title: string;


  public description: string;


  public date: string;


  public city: City;


  public previewImage: string;


  public images: string[];


  public isFavorite: boolean;


  public isPremium: boolean;


  public rating: number;


  public bedrooms: number;


  public maxAdults: number;


  public host: User;


  public type: string;


  public price: number;


  public goods: string[];


  public location: Location;


  public comments: number;
}

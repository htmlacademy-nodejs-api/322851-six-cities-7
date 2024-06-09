import { User } from './user.type.js';
import { City } from './city.type.js';

export type Offer = {
  title: string;
  description: string;
  date: string;
  city: City;
  previewImage: string;
  images: string[];
  isFavorite?: boolean;
  isPremium: boolean;
  rating?: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: string[];
  host: User;
  comments?: number;
  offerLatitude: number;
  offerLongitude: number;
  offerZoom: number;
};



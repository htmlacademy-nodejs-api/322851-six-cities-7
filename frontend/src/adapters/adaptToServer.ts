import { UserType } from '../const';
import { CreateOfferDto } from '../dto/create-offer.dto';
import { NewOffer, Offer, User } from '../types/types';

export function adaptUserToServer({ email, name, type}: User) {
  return {
    email,
    name,
    isPro: type === UserType.Pro
  };
}


export function adaptOfferToServer(offer: NewOffer | Offer): CreateOfferDto {
  const date = new Date(Date.now());
  return {
    title: offer.title,
    description: offer.description,
    date: date.toISOString(),
    city: offer.city.name,
    isPremium: offer.isPremium,
    bedrooms: offer.bedrooms,
    maxAdults: offer.maxAdults,
    type: offer.type,
    price: offer.price,
    goods: offer.goods,
    offerLatitude: offer.location.latitude,
    offerLongitude: offer.location.longitude
  };
}

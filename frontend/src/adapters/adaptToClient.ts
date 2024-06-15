import { UserType } from '../const';
import { CommentDto } from '../dto/comment.dto';
import { DetailedOfferDto } from '../dto/detailed-offer.dto';
import { LoggedUserDto } from '../dto/logged-user.dto';
import { ShortOfferDto } from '../dto/short-offer.dto';
import { Comment, Offer, Type, User } from '../types/types';

export const adaptOfferToClient = (offers: ShortOfferDto): Offer => ({
  id: offers.id,
  price: offers.price,
  rating: parseFloat(offers.rating),
  title: offers.title,
  isPremium: offers.isPremium,
  isFavorite: offers.isFavorite,
  city: {
    name: offers.city.name,
    location: {
      longitude: offers.city.longitude,
      latitude: offers.city.latitude
    }
  },
  location: {
    longitude: offers.offerLongitude,
    latitude: offers.offerLatitude
  },
  previewImage: offers.previewImage,
  type: offers.type as Type
});

export const adaptDetailedOfferToClient = (offers: DetailedOfferDto): Offer => ({
  id: offers.id,
  price: offers.price,
  rating: parseFloat(offers.rating),
  title: offers.title,
  isPremium: offers.isPremium,
  isFavorite: offers.isFavorite,
  city: {
    name: offers.city.name,
    location: {
      longitude: offers.city.longitude,
      latitude: offers.city.latitude
    }
  },
  location: {
    longitude: offers.offerLongitude,
    latitude: offers.offerLatitude
  },
  previewImage: offers.previewImage,
  type: offers.type as Type,
  bedrooms: offers.bedrooms,
  description: offers.description,
  goods: offers.goods,
  host: adaptUserToClient(offers.host),
  images: offers.images,
  maxAdults: offers.maxAdults
});

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  ...comment,
  user: adaptUserToClient(comment.user)
});


export const adaptUserToClient = (user: LoggedUserDto): User => ({
  name: user.name,
  avatarUrl: user.avatar,
  type: (user.isPro) ? UserType.Pro : UserType.Regular,
  email: user.email
});

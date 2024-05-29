import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity, UpdateOfferDto } from './index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  find(count: number): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  decCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  changeRating(offerId: string, newRate: number): Promise<void>;
  findPremiunOffers(city: string, count: number): Promise<DocumentType<OfferEntity>[]>;
  findFavoriteOffers(userId: string): Promise<DocumentType<OfferEntity>[]>;
  changeFavoriteStatus(offerId: string, status: boolean): Promise<DocumentType<OfferEntity> | null>;
}

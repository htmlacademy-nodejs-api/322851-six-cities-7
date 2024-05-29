import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity, OfferService, UpdateOfferDto } from './index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  private DEFAULT_OFFERS_COUNT = 60;
  private DEFAULT_PREMIUM_OFFERS_COUNT = 3;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>) {
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const newOffer = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${newOffer.id} ${newOffer.title}`);
    return newOffer;
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? this.DEFAULT_OFFERS_COUNT;
    return this.offerModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate(['host', 'city'])
      .exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['host', 'city']).exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).populate(['host', 'city']).exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, {$inc: {comments: 1}}).exec();
  }

  public async decCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, {$inc: {comments: -1}}).exec();
  }

  public async changeRating(offerId: string, newRate: number): Promise<void> {
    await this.offerModel.findByIdAndUpdate(
      offerId,
      [{$set: { rating: {$multiply: [{$add: ['$rating', newRate]}, 0.5]}}}]);
  }

  public async findPremiunOffers(city: string, count: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? this.DEFAULT_PREMIUM_OFFERS_COUNT;
    return this.offerModel.find({city: city, isPremium: true}, {}, {limit}).populate(['host', 'city']).exec();
  }

  public async findFavoriteOffers(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({host: userId, isFavorite: true}).populate(['host', 'city']).exec();
  }

  public async changeFavoriteStatus(offerId: string, status: boolean): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, {isFavorite: status}).populate(['host', 'city']).exec();
  }

}

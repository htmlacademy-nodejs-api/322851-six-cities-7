import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity, OfferService, UpdateOfferDto } from './index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/index.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultOfferService implements OfferService {
  private DEFAULT_OFFERS_COUNT = 60;
  private DEFAULT_PREMIUM_OFFERS_COUNT = 3;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>) {
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const newOffer = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${newOffer.id} ${newOffer.title}`);
    return await this.findById(newOffer.id);
  }

  public async exists(documentId: string): Promise<boolean> {
    const offer = await this.offerModel.findById(documentId);
    return Boolean(offer);
  }

  public async find(email: string, count?: number,): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? this.DEFAULT_OFFERS_COUNT;
    const offer = await this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            let: {
              offerID: {$toString: '$_id'}, userEmail: email
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      '$email',
                      '$$userEmail'
                    ]
                  }
                }
              },
              {
                $match: {
                  $expr: {
                    $in: [
                      '$$offerID',
                      '$favorites'
                    ]
                  }
                }
              },
              {
                $replaceWith: {
                  isFavorite: true
                }
              }
            ],
            as: 'test'
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$$ROOT',
                {
                  $arrayElemAt: [
                    '$test',
                    0
                  ]
                }
              ]
            }
          }
        },
        {
          $project: {test: 0}
        }
      ])
      .sort({ createdAt: -1 })
      .limit(limit)
      .lookup({
        from: 'cities',
        localField: 'city',
        foreignField: '_id',
        as: 'city'
      })
      .unwind({path: '$city'})
      .exec();

    return offer;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('host').populate('city').exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).populate('host').populate('city').exec();
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

  public async findPremiumOffers(city: string, count: number, email: string): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? this.DEFAULT_PREMIUM_OFFERS_COUNT;

    return this.offerModel.aggregate([
      {
        $match: {
          city: new Types.ObjectId(city)
        }
      },
      {
        $match: {
          isPremium: true
        }
      },
      {
        $lookup: {
          from: 'users',
          let: {
            offerID: {$toString: '$_id'},
            userEmail: email,
            cityInOffer: {$toString: '$city'},
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    '$email',
                    '$$userEmail'
                  ]
                }
              }
            },
            {
              $match: {
                $expr: {
                  $in: [
                    '$$offerID',
                    '$favorites'
                  ]
                }
              }
            },
            {
              $replaceWith: {
                isFavorite: true
              }
            }
          ],
          as: 'test'
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$$ROOT',
              {
                $arrayElemAt: [
                  '$test',
                  0
                ]
              }
            ]
          }
        }
      },
      {
        $project: {test: 0}
      }
    ]).limit(limit)
      .lookup({
        from: 'cities',
        localField: 'city',
        foreignField: '_id',
        as: 'city'
      })
      .unwind({path: '$city'}).exec();
  }

  public async changeFavoriteStatus(offerId: string, status: boolean): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, {isFavorite: status}).populate(['host', 'city']).exec();
  }

  public async findFavoriteOffers(favorites: string[]): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({_id: {$in: favorites}}).populate(['host', 'city']).exec();
  }
}

import { inject, injectable } from 'inversify';
import { BaseController, HttpError, HttpMethod, RequestBody, RequestParams } from '../../../rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/index.js';
import { fillRdo } from '../../helpers/common.js';
import { ShortOfferRdo, CreateOfferDto, OfferService, DetailedOfferRdo, UpdateOfferDto } from './index.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CityService } from '../city/city-service.interface.js';
import { UserService } from '../user/user-service.interface.js';

@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.UserService) private readonly userService: UserService
  ) {
    super(logger);

    this.logger.info('Register routes for offer controller');

    this.addRoute({path: '/offers', method: HttpMethod.GET, handler: this.index});
    this.addRoute({path: '/offers', method: HttpMethod.POST, handler: this.create});
    this.addRoute({path: '/offers/:offerId', method: HttpMethod.GET, handler: this.showOffer});
    this.addRoute({path: '/offers/:offerId', method: HttpMethod.PUT, handler: this.update});
    this.addRoute({path: '/offers/:offerId', method: HttpMethod.DELETE, handler: this.delete});
    this.addRoute({path: '/favorites', method: HttpMethod.GET, handler: this.showFavorites});
    this.addRoute({path: '/favorites/:offerId/:status', method: HttpMethod.PATCH, handler: this.updateFavorites});
    this.addRoute({path: '/premiumOffers/:cityName', method: HttpMethod.GET, handler: this.showPremiumOffers});
  }

  private async index(
    _req: Request,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.find(3);
    const result = offers.map((offer) => fillRdo(ShortOfferRdo, offer));

    this.ok(res, result);
  }

  private async create(
    req: Request<RequestParams, RequestBody, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const city = await this.cityService.findByName(req.body.city);
    const host = await this.userService.findById('6650f4cf1b81400365741b71');

    const newOffer = await this.offerService.create({...req.body, city: city?.id, host: host?.id});

    this.created(res, fillRdo(DetailedOfferRdo, newOffer));
  }

  private async showOffer(
    req: Request<Record<string, string>, RequestBody, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerId} not found`,
        'Offer controller'
      );
    }

    this.ok(res, fillRdo(DetailedOfferRdo, fillRdo(DetailedOfferRdo, offer)));
  }

  private async update(
    req: Request<Record<string, string>, RequestBody, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerId} not found`,
        'Offer controller'
      );
    }

    const result = await this.offerService.updateById(req.params.offerId, req.body);

    this.ok(res, fillRdo(DetailedOfferRdo, fillRdo(DetailedOfferRdo, result)));
  }

  private async delete(
    req: Request<Record<string, string>, RequestBody, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerId} not found`,
        'Offer controller'
      );
    }

    await this.offerService.deleteById(req.params.offerId);

    this.noContent(res);
  }

  private async showFavorites(
    _req: Request<RequestParams, RequestBody>,
    res: Response
  ) {
    const user = await this.userService.findById('665bb18dcdd618cb1169f48f');
    if (user) {
      const offers = await this.offerService.findFavoriteOffers(user.favorites);
      const result = offers.map((offer) => {
        offer.isFavorite = true;
        return fillRdo(ShortOfferRdo, offer);
      });
      this.ok(res, result);
    }
  }

  private async updateFavorites(
    req: Request<Record<string, string>, RequestBody>,
    res: Response
  ) {
    const offer = await this.offerService.findById(req.params.offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerId} not found`,
        'Offer controller'
      );
    }
    let user = await this.userService.findById('665bb18dcdd618cb1169f48f');

    if (user && (user.favorites.includes(req.params.offerId) && req.params.status === '0')) {
      user = await this.userService.deleteFromFavorites('665bb18dcdd618cb1169f48f', req.params.offerId);
      offer.isFavorite = false;
    } else if (user && (!(user.favorites.includes(req.params.offerId)) && req.params.status === '1')) {
      user = await this.userService.addToFavorites('665bb18dcdd618cb1169f48f', req.params.offerId);
      offer.isFavorite = true;
    } else {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Wrong status',
        'Offer controller'
      );
    }

    this.ok(res, fillRdo(DetailedOfferRdo, offer));
  }

  private async showPremiumOffers(
    req: Request<Record<string, string>, RequestBody>,
    res: Response
  ) {
    const city = await this.cityService.findByName(req.params.cityName);
    if (!city) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `City ${req.params.cityName} not found`
      );
    }
    const offers = await this.offerService.findPremiunOffers(city.id, 3);
    const result = offers.map((offer) => fillRdo(ShortOfferRdo, offer));

    this.ok(res, result);
  }
}

import { inject, injectable } from 'inversify';
import {
  BaseController,
  HttpError,
  HttpMethod,
  RequestBody,
  RequestParams,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware } from '../../../rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/index.js';
import { fillRdo } from '../../helpers/common.js';
import { ShortOfferRdo, CreateOfferDto, OfferService, DetailedOfferRdo, UpdateOfferDto } from './index.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CityService } from '../city/city-service.interface.js';
import { UserService } from '../user/user-service.interface.js';
import { PrivateRouteMiddleware } from '../../../rest/middleware/private-route.middleware.js';
import { Setting } from '../../const.js';

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

    this.addRoute({
      path: '/offers',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)]
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.GET,
      handler: this.showOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ]});

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.PATCH,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ]
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.DELETE,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ]
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.GET,
      handler: this.showFavorites,
      middlewares: [
        new PrivateRouteMiddleware()
      ]});

    this.addRoute({
      path: '/favorites/:offerId/:status',
      method: HttpMethod.PATCH,
      handler: this.updateFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ]
    });

    this.addRoute({path: '/premiumOffers/:cityName', method: HttpMethod.GET, handler: this.showPremiumOffers});
  }

  private async index(
    req: Request,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.find(req.tokenPayload?.email);
    const result = offers.map((offer) => fillRdo(ShortOfferRdo, offer));

    this.ok(res, result);
  }

  private async create(
    req: Request<RequestParams, RequestBody, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const city = await this.cityService.findByName(req.body.city);
    const host = req.tokenPayload;

    const newOffer = await this.offerService.create({...req.body, city: city?.id, host: host.id});

    this.created(res, fillRdo(DetailedOfferRdo, newOffer));
  }

  private async showOffer(
    req: Request<Record<string, string>, RequestBody>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);
    if (req.tokenPayload) {
      const user = await this.userService.findByEmail(req.tokenPayload.email);
      offer!.isFavorite = user!.favorites.includes(req.params.offerId);
    }
    this.ok(res, fillRdo(DetailedOfferRdo, offer));
  }

  private async update(
    req: Request<Record<string, string>, RequestBody, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.updateById(req.params.offerId, req.body);

    if (req.tokenPayload) {
      const user = await this.userService.findByEmail(req.tokenPayload.email);
      offer!.isFavorite = user!.favorites.includes(req.params.offerId);
    }

    this.ok(res, fillRdo(DetailedOfferRdo, fillRdo(DetailedOfferRdo, offer)));
  }

  private async delete(
    req: Request<Record<string, string>, RequestBody, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    await this.offerService.deleteById(req.params.offerId);

    this.noContent(res);
  }

  private async showFavorites(
    req: Request<RequestParams, RequestBody>,
    res: Response
  ) {
    const user = await this.userService.findByEmail(req.tokenPayload.email);

    if (user) {
      const offers = await this.offerService.findFavoriteOffers(user?.favorites);
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

    const user = await this.userService.findByEmail(req.tokenPayload.email);
    this.logger.warning(`status: ${req.params.status === '1'}`);

    if (offer && user && (user.favorites.includes(offer.id) && req.params.status === '0')) {
      await this.userService.deleteFromFavorites('665bb18dcdd618cb1169f48f', offer.id);
      offer.isFavorite = false;
    } else if (offer && user && (!(user.favorites.includes(offer.id)) && req.params.status === '1')) {
      await this.userService.addToFavorites('665bb18dcdd618cb1169f48f', offer.id);
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
    const offers = await this.offerService.findPremiumOffers(city.id, Setting.PREMIUM_OFFERS_COUNT, req.tokenPayload?.email);
    const result = offers.map((offer) => fillRdo(ShortOfferRdo, offer));

    this.ok(res, result);
  }
}

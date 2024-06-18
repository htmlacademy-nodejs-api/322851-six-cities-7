import { inject, injectable } from 'inversify';
import {
  BaseController,
  HttpError,
  HttpMethod,
  RequestBody,
  RequestParams,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  UploadFileMiddleware,
  ValidateAuthorMiddleware} from '../../../rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Config, Logger, RestSchema } from '../../libs/index.js';
import { fillRdo } from '../../helpers/common.js';
import { ShortOfferRdo, CreateOfferDto, OfferService, DetailedOfferRdo, UpdateOfferDto } from './index.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CityService } from '../city/city-service.interface.js';
import { UserService } from '../user/user-service.interface.js';
import { PrivateRouteMiddleware } from '../../../rest/middleware/private-route.middleware.js';
import { DEFAULT_STATIC_IMAGES, Setting } from '../../const.js';
import { UserNotFoundException } from '../auth/index.js';
import { CommentService } from '../comment/comment-service.interface.js';

@injectable()
export class OfferController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CityService) private readonly cityService: CityService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.Config) protected readonly config: Config<RestSchema>
  ) {
    super(logger, config);

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
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer'),
        new ValidateAuthorMiddleware(this.offerService)
      ]
    });

    this.addRoute({
      path: '/offers/:offerId',
      method: HttpMethod.DELETE,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer'),
        new ValidateAuthorMiddleware(this.offerService)
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
      method: HttpMethod.POST,
      handler: this.updateFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ]
    });

    this.addRoute({
      path: '/offers/:offerId/images',
      method: HttpMethod.POST,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer'),
        new ValidateAuthorMiddleware(this.offerService),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), [{name: 'image', maxCount: 6}])
      ]
    });

    this.addRoute({
      path: '/offers/:offerId/preview',
      method: HttpMethod.POST,
      handler: this.uploadPreview,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer'),
        new ValidateAuthorMiddleware(this.offerService),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), [{name: 'preview', maxCount: 1}])
      ]
    });

    this.addRoute({path: '/premium/:cityName', method: HttpMethod.GET, handler: this.showPremiumOffers});
  }

  private async index(
    req: Request,
    res: Response
  ): Promise<void> {
    const count = (req.query.count && typeof req.query.count === 'string') ? parseInt(req.query.count, 10) : Setting.MAX_OFFERS_COUNT;
    const offers = await this.offerService.find(req.tokenPayload?.email, count);
    const result = offers.map((offer) => fillRdo(ShortOfferRdo, {...offer, id: offer._id.toString()}));

    this.ok(res, result);
  }

  private async create(
    req: Request<RequestParams, RequestBody, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const city = await this.cityService.findByName(req.body.city);
    const host = req.tokenPayload;
    let images = DEFAULT_STATIC_IMAGES.filter((item) => item.startsWith('default-image'));
    let previewImage = 'default-preview.jpg';

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      images = files.image && files.image.map((image) => image.filename);
      previewImage = files.preview[0] && files.preview[0].filename;
    }

    const newOffer = await this.offerService.create({...req.body, city: city?.id, host: host.id, images, previewImage});

    this.created(res, fillRdo(DetailedOfferRdo, {...newOffer, id: newOffer?._id.toString()}));
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
    if (req.body.city) {
      const city = await this.cityService.findByName(req.body.city);
      req.body.city = city?.id;
    }

    const newOffer = await this.offerService.updateById(req.params.offerId, { ...req.body});

    if (req.tokenPayload) {
      const user = await this.userService.findByEmail(req.tokenPayload.email);
      newOffer!.isFavorite = user!.favorites.includes(req.params.offerId);
    }

    this.ok(res, fillRdo(DetailedOfferRdo, fillRdo(DetailedOfferRdo, newOffer)));
  }

  private async delete(
    req: Request<Record<string, string>, RequestBody, UpdateOfferDto>,
    res: Response
  ): Promise<void> {

    await Promise.all([
      this.offerService.deleteById(req.params.offerId),
      this.commentService.deleteByOfferId(req.params.offerId)
    ]);

    this.noContent(res);
  }

  private async showFavorites(
    req: Request<RequestParams, RequestBody>,
    res: Response
  ) {
    const user = await this.userService.findByEmail(req.tokenPayload.email);

    if (!user) {
      throw new UserNotFoundException();
    }

    const offers = await this.offerService.findFavoriteOffers(user.favorites);
    const result = offers.map((offer) => {
      offer.isFavorite = true;
      return fillRdo(ShortOfferRdo, offer);
    });
    this.ok(res, result);

  }

  private async updateFavorites(
    req: Request<Record<string, string>, RequestBody>,
    res: Response
  ) {
    console.log(req.params.offerId);
    const [offer, user] = await Promise.all([
      this.offerService.findById(req.params.offerId),
      this.userService.findByEmail(req.tokenPayload.email)
    ]);

    if (offer && user && (user.favorites.includes(offer.id) && req.params.status === '0')) {
      this.logger.warning(`Delete from favorites offer ${offer.id} by user ${user.email}`);
      await this.userService.deleteFromFavorites(user.id, offer.id);
      offer.isFavorite = false;
    } else if (offer && user && (!(user.favorites.includes(offer.id)) && req.params.status === '1')) {
      this.logger.warning(`Add to favorites offer ${offer.id} by user ${user.email}`);
      await this.userService.addToFavorites(user.id, offer.id);
      offer.isFavorite = true;
    } else {
      this.logger.warning('Wrong status');
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

  private async uploadImages(
    req: Request<Record<string, string>, RequestBody>,
    res: Response
  ) {
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const images = files.image.map((image) => image.filename);
      await this.offerService.updateById(req.params.offerId, {images});
      this.created(res, images);
    }
  }

  private async uploadPreview(
    req: Request<Record<string, string>, RequestBody>,
    res: Response
  ) {
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      console.log(files.preview);
      await this.offerService.updateById(req.params.offerId, {previewImage: files.preview?.[0].filename});
      this.created(res, files.preview[0].path);
    }
  }
}

import { inject, injectable } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpMethod, RequestBody, ValidateObjectIdMiddleware } from '../../../rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/index.js';
import { CommentRdo, CommentService, CreateCommentDto} from './index.js';
import { Request, Response } from 'express';
import { fillRdo } from '../../helpers/index.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { PrivateRouteMiddleware } from '../../../rest/middleware/private-route.middleware.js';

@injectable()
export class CommentController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for comment controller');

    this.addRoute({
      path: '/comments/:offerId',
      method: HttpMethod.GET,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ]
    });

    this.addRoute({
      path: '/comments/:offerId',
      method: HttpMethod.POST,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offerId', 'Offer')
      ]
    });
  }

  private async index(
    req: Request<Record<string, string>, RequestBody>,
    res: Response
  ) {
    const comments = await this.commentService.findByOfferId(req.params.offerId);

    this.ok(res,fillRdo(CommentRdo, comments));
  }

  private async create(
    req: Request<Record<string, string>, RequestBody, CreateCommentDto>,
    res: Response
  ) {
    const user = req.tokenPayload;
    const newComment = await this.commentService.create({...req.body, offerId: req.params.offerId ,user: user.id});
    await this.offerService.incCommentCount(req.params.offerId);
    await this.offerService.changeRating(req.params.offerId, newComment.rating);


    this.created(res, fillRdo(CommentRdo, newComment));
  }
}

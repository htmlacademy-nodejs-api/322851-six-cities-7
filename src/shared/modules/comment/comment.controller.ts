import { inject, injectable } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpMethod, RequestBody, ValidateObjectIdMiddleware } from '../../../rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/index.js';
import { CommentRdo, CommentService, CreateCommentDto} from './index.js';
import { Request, Response } from 'express';
import { fillRdo } from '../../helpers/index.js';
import { UserService } from '../user/user-service.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';

@injectable()
export class CommentController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
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
    const user = await this.userService.findById('6650f4cf1b81400365741b71');
    const newComment = await this.commentService.create({...req.body, user: user?.id});
    await this.offerService.incCommentCount(req.params.offerId);
    await this.offerService.changeRating(req.params.offerId, newComment.rating);


    this.created(res, fillRdo(CommentRdo, newComment));
  }
}

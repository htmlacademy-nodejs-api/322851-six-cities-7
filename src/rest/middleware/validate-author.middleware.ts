import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/http-error.js';
import { OfferService } from '../../shared/modules/offer/offer-service.interface.js';

export class ValidateAuthorMiddleware implements Middleware {
  constructor(
    private readonly offerService: OfferService
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);

    if (!(offer?.host._id === new Types.ObjectId(req.tokenPayload.id))) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User ${req.tokenPayload.email} is not allowed to edit offer ${req.params.offerId}`,
        'DocumentExistsMiddleware'
      );
    }

    next();

  }
}

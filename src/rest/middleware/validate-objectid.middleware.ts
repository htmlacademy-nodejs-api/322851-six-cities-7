import { Request, Response, NextFunction } from 'express';
import { Middleware, HttpError } from '../index.js';
import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(
    private readonly param: string
  ) {}

  execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${this.param} is not valid ObjectId type`,
      'ValidateObjectIdMiddleware'
    );
  }
}

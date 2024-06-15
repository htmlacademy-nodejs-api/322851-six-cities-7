import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Component } from '../../shared/types/component.enum.js';
import { Logger } from '../../shared/libs/index.js';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../shared/helpers/common.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register HttpExceptionFilter');
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpException] ${req.path} ${error.message}`, error);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}

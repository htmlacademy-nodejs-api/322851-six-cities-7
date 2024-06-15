import { inject, injectable } from 'inversify';
import { ApplicationError, ExceptionFilter, HttpError } from '../index.js';
import { Component } from '../../shared/types/component.enum.js';
import { Logger } from '../../shared/libs/index.js';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../shared/helpers/common.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error | HttpError, _req: Request, res: Response, _next: NextFunction): void {

    this.logger.error(`[app] ${error.message}`, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}

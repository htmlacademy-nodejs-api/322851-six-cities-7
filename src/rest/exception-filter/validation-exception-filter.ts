import { Request, Response, NextFunction } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../shared/types/component.enum.js';
import { Logger } from '../../shared/libs/index.js';
import { ValidationError } from '../errors/validation-error.js';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../shared/helpers/common.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: Error, _req: Request, res: Response, next: NextFunction): void {
    if (! (error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationException] ${error.message}`, error);

    error.details.forEach(
      (errorField) => this.logger.warning(`${errorField.property} - ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.ValidationError, error.message, error.details));
  }
}

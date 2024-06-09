import { injectable, inject } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, UploadFileMiddleware } from '../../../rest/index.js';
import { Component } from '../../types/index.js';
import { Config, Logger, RestSchema } from '../../libs/index.js';
import { NextFunction, Response, Request } from 'express';
import { CreateUserRequest, UserService, UserRdo } from './index.js';
import { StatusCodes } from 'http-status-codes';
import { fillRdo } from '../../helpers/common.js';

@injectable()
export class UserController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    super(logger);
    this.logger.info('Register routes for user controller ...');

    this.addRoute({path: '/register', method: HttpMethod.POST, handler: this.create});
    this.addRoute({path: '/auth', method: HttpMethod.GET, handler: this.auth});
    this.addRoute({path: '/login', method: HttpMethod.POST, handler: this.login});
    this.addRoute({path: '/logout', method: HttpMethod.POST, handler: this.logout});
    this.addRoute({
      path: '/user/:userId/avatar',
      method: HttpMethod.POST,
      handler: this.uploadAvatar,
      middlewares: [
        new DocumentExistsMiddleware(this.userService, 'userId', 'User'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar')
      ]

    });
  }

  public async create(
    req: CreateUserRequest,
    res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(req.body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${req.body.email} already exists`,
        'UserController'
      );
    }

    const newUser = await this.userService.create(req.body, this.config.get('SALT'));

    this.created(res, fillRdo(UserRdo, newUser));
  }


  public async auth(
    _req: CreateUserRequest,
    _res: Response,
    _next: NextFunction
  ): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async login(
    req: CreateUserRequest,
    _res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(req.body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${req.body.email} not found`,
        'UserController'
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async logout(
    _req: CreateUserRequest,
    _res: Response
  ): Promise<void> {

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController'
    );
  }

  public async uploadAvatar(
    req: Request,
    res: Response
  ) : Promise<void> {
    this.created(res, req.file?.path);
  }


}

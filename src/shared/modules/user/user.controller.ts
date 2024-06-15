import { injectable, inject } from 'inversify';
import { BaseController, DocumentExistsMiddleware, HttpError, HttpMethod, UploadFileMiddleware } from '../../../rest/index.js';
import { Component } from '../../types/index.js';
import { Config, Logger, RestSchema } from '../../libs/index.js';
import { Response, Request } from 'express';
import {
  CreateUserRequest,
  UserService,
  UserRdo,
  LoggedUserRdo,
  LoginUserRequest } from './index.js';
import { StatusCodes } from 'http-status-codes';
import { fillRdo } from '../../helpers/common.js';
import { AuthService } from '../auth/auth-service.interface.js';
import { PrivateRouteMiddleware } from '../../../rest/middleware/private-route.middleware.js';

@injectable()
export class UserController extends BaseController {

  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) protected readonly config: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger, config);
    this.logger.info('Register routes for user controller ...');

    this.addRoute({path: '/register', method: HttpMethod.POST, handler: this.create});
    this.addRoute({path: '/login', method: HttpMethod.GET, handler: this.auth});
    this.addRoute({path: '/login', method: HttpMethod.POST, handler: this.login});
    this.addRoute({
      path: '/:email/avatar',
      method: HttpMethod.POST,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.userService, 'email', 'User'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), [{name: 'avatar', maxCount: 1}])
      ]

    });

    this.addRoute({
      path: '/logout',
      method: HttpMethod.DELETE,
      handler: this.logout,
      middlewares: [
        new PrivateRouteMiddleware()
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
    req: CreateUserRequest,
    res: Response
  ): Promise<void> {

    const user = await this.userService.findByEmail(req.tokenPayload.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillRdo(LoggedUserRdo, user));
  }

  public async login(
    req: LoginUserRequest,
    res: Response
  ): Promise<void> {
    const user = await this.authService.verify(req.body);
    const token = await this.authService.authenticate(user);
    const responseData = fillRdo(LoggedUserRdo, user);

    this.ok(res, fillRdo(LoggedUserRdo, {...responseData, token}));
  }

  public async uploadAvatar(
    req: Request,
    res: Response
  ) : Promise<void> {
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      this.logger.warning(`${files.avatar[0].filename}`);
      await this.userService.addAvatar(req.params.email, files.avatar[0].filename);
      this.created(res, files.avatar[0].path);
    }

  }

  public logout(
    _req: Request,
    res: Response
  ): void {
    this.noContent(res, {});
  }
}

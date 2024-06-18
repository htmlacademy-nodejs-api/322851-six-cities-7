import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';
import { inject, injectable } from 'inversify';

import { UserEntity, LoginUserDto, UserService } from '../user/index.js';
import { AuthService, TokenPayload, UserNotFoundException, UserPasswordIncorrectException } from './index.js';
import { Component } from '../../types/component.enum.js';
import { Config, Logger, RestSchema } from '../../libs/index.js';
import { JWTtSetting } from '../../const.js';


@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.UserService) private readonly userService: UserService
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');

    const tokenPayload: TokenPayload = {
      name: user.name,
      email: user.email,
      id: user.id,
      isPro: user.isPro
    };

    this.logger.info(`Create token for ${user.email}`);

    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWTtSetting.ALGORYTHM })
      .setIssuedAt()
      .setExpirationTime(JWTtSetting.EXPIRATION_TIME)
      .sign(secretKey);


  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      this.logger.warning(`User with email ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (! user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warning(`Password for ${dto.email} is not correct`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }

}

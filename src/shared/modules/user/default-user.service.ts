import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto, UserService, UserEntity } from './index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/index.js';

@injectable()
export class DefaultUserService implements UserService {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);
    const result = this.userModel.create(user);
    this.logger.info(`New user created:  ${user.email}`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(id).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    const user = await this.userModel.exists({_id: documentId});
    return Boolean(user);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email}).exec();
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    let user = await this.findByEmail(dto.email);

    if (!user) {
      user = await this.create(dto, salt);
    }

    return user;
  }

  public async addToFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, {$push: {favorites: offerId}}).exec();
  }

  public async deleteFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, {$pull: {favorites: offerId}}).exec();
  }
}

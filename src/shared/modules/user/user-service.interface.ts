import { DocumentExists } from '../../types/document-exists.interface.js';
import { CreateUserDto, UserEntity } from './index.js';
import { DocumentType } from '@typegoose/typegoose';

export interface UserService extends DocumentExists {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findById(id:string): Promise<DocumentType<UserEntity> | null>,
  addAvatar(id:string, avatar: string): Promise<DocumentType<UserEntity> | null>,
  findByEmail(email:string): Promise<DocumentType<UserEntity> | null>,
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>,
  addToFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>,
  deleteFromFavorites(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null>
}

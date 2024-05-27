import { CommentEntity, CreateCommentDto } from './index.js';
import { DocumentType } from '@typegoose/typegoose';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(id: string): Promise<DocumentType<CommentEntity> | null>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deletefindByOfferId(offerId: string): Promise<number>;
}

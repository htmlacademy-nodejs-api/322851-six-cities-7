import { CommentEntity, CreateCommentDto, UpdateCommentDto } from './index.js';
import { DocumentType } from '@typegoose/typegoose';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(id: string): Promise<DocumentType<CommentEntity> | null>;
  updateById(id: string,dto: UpdateCommentDto): Promise<DocumentType<CommentEntity> | null>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number>;
}

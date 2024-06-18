import { DocumentExists } from '../../types/document-exists.interface.js';
import { CommentEntity, CreateCommentDto } from './index.js';
import { DocumentType } from '@typegoose/typegoose';

export interface CommentService extends DocumentExists {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findById(id: string): Promise<DocumentType<CommentEntity> | null>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<void>;
}

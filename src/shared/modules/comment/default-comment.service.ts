import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity, CommentService, CreateCommentDto } from './index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/index.js';
import { Setting } from '../../const.js';

@injectable()
export class DefaultCommentService implements CommentService {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const newComment = await this.commentModel.create(dto);
    this.logger.info(`Create new comment ${newComment.id}`);
    return newComment;
  }

  public async exists(documentId: string): Promise<boolean> {
    const comment = await this.commentModel.exists({_id: documentId});
    return Boolean(comment);
  }

  public async findById(id: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findById(id).exec();
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({offerId: offerId}).limit(Setting.MAX_COMMENTS_COUNT).populate('offerId').exec();
  }
}

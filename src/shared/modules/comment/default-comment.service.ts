import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity, CommentService, CreateCommentDto, UpdateCommentDto } from './index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/index.js';

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

  public async findById(id: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findById(id).exec();
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({offerId}).populate('offerId').exec();
  }

  public async updateById(id: string, dto: UpdateCommentDto): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel.findByIdAndUpdate(id, dto).populate('offerId').exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const { deletedCount } = await this.commentModel.deleteMany({offerId}).exec();
    return deletedCount;
  }
}

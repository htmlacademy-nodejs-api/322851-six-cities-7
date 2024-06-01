import { Container } from 'inversify';
import { CommentEntity, CommentModel, CommentService, DefaultCommentService} from './index.js';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();

  return commentContainer;
}

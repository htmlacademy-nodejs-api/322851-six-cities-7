import { Container } from 'inversify';
import { CommentEntity, CommentModel, CommentService, DefaultCommentService} from './index.js';
import { Component } from '../../types/component.enum.js';
import { types } from '@typegoose/typegoose';
import { Controller } from '../../../rest/index.js';
import { CommentController } from './comment.controller.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  commentContainer.bind<Controller>(Component.CommentController).to(CommentController).inSingletonScope();

  return commentContainer;
}

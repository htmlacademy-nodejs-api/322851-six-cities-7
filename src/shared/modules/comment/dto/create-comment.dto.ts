import { IsDateString, IsInt, IsMongoId, Max, MaxLength, Min, MinLength } from 'class-validator';
import { CommentValidationMessage } from './comment-validation-message.js';

export class CreateCommentDto {
  @IsDateString({}, {message: CommentValidationMessage.date.dateValidation})
  public date: string;

  @MinLength(5, {message: CommentValidationMessage.comment.minLength})
  @MaxLength(1024, {message: CommentValidationMessage.comment.maxLength})
  public comment: string;

  @IsInt()
  @Min(1, {message: CommentValidationMessage.rating.min})
  @Max(5, {message: CommentValidationMessage.rating.max})
  public rating: number;

  @IsMongoId({message: CommentValidationMessage.user.objectId})
  public user: string;
}

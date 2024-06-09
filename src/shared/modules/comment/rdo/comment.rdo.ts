import { Expose } from 'class-transformer';
import { User } from '../../../types/user.type.js';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public date: string;

  @Expose()
    user: User;

  @Expose()
    comment: string;

  @Expose()
    rating:number;
}

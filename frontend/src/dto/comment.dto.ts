import { LoggedUserDto } from './logged-user.dto';

export class CommentDto {
  public id!: string;

  public date!: string;

  public user!: LoggedUserDto;

  public comment!: string;

  public rating!:number;
}

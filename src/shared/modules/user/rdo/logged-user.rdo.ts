import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public email: string;

  @Expose()
  public token: string;

  @Expose()
  public avatar: string;

  @Expose()
  public isPro: boolean;

  @Expose()
  public name: string;
}

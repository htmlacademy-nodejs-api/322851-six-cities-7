export class CreateUserDto {
  public email: string;
  public password?: string;
  public name: string;
  public avatar?: string;
  public isPro: boolean;
}

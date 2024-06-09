import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { UserValidationMessage } from './user-validation-message.js';

export class LoginUserDto {

  @IsEmail({}, {message: UserValidationMessage.email.email})
  public email: string;

  @MinLength(6, {message: UserValidationMessage.password.minLength})
  @MaxLength(12, {message: UserValidationMessage.password.maxLength})
  public password?: string;
}

import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserValidationMessage } from './user-validation-message.js';

export class CreateUserDto {

  @IsEmail({}, {message: UserValidationMessage.email.email})
  public email: string;

  @MinLength(6, {message: UserValidationMessage.password.minLength})
  @MaxLength(12, {message: UserValidationMessage.password.maxLength})
  public password: string;

  @MinLength(6, {message: UserValidationMessage.name.minLength})
  @MaxLength(12, {message: UserValidationMessage.name.maxLength})
  public name: string;

  @IsOptional()
  @IsString({message: UserValidationMessage.avatar.type})
  public avatar?: string;

  @IsBoolean({message: UserValidationMessage.isPro.type})
  public isPro: boolean;
}

import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User } from '../../types/index.js';
import { Types } from 'mongoose';
import { createSHA256 } from '../../helpers/hash.js';


@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User, defaultClasses.Base {
  @prop({unique: true, required: true})
  public email: string;

  @prop({required: true, default: ''})
  private password?: string;

  @prop({required: true, default: ''})
  public avatar?: string | undefined;

  @prop({required: true})
  public name: string;

  @prop({required: true})
  public isPro: boolean;

  @prop({required: true})
  public id: string;

  @prop({required: true})
  public _id: Types.ObjectId;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.isPro = userData.isPro;
  }

  public getPassword() {
    return this.password;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

}
export const UserModel = getModelForClass(UserEntity);

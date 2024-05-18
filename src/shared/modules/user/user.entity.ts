import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User } from '../../types/index.js';
import { createSHA256 } from '../../helpers/hash.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}


@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
    id: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements Omit<User, 'password'> {
  @prop({unique: true, required: true})
  public email: string;

  @prop({required: true, default: ''})
  private password?: string;

  @prop({default: ''})
  public avatar?: string;

  @prop({required: true})
  public name: string;

  @prop({required: true})
  public isPro: boolean;

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

  public setPassword(password: string | undefined, salt: string) {
    if (password) {
      this.password = createSHA256(password, salt);
    }
  }

}
export const UserModel = getModelForClass(UserEntity);

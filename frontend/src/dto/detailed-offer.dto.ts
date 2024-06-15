import { LoggedUserDto } from './logged-user.dto';
import { ShortOfferDto } from './short-offer.dto';

export class DetailedOfferDto extends ShortOfferDto {
  public description!: string;

  public images!: string[];

  public bedrooms!: number;

  public maxAdults!: number;

  public host!: LoggedUserDto;

  public goods!: string[];
}

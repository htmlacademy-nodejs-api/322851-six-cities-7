import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  Min,
  Max,
  MaxLength,
  MinLength,
  IsIn,
  IsString,
  ArrayMaxSize,
  ArrayMinSize,
  IsLongitude,
  IsLatitude} from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { PLACE_BENEFITS, PLACE_TYPES, SixCities } from '../../../const.js';

export class CreateOfferDto {
  @MinLength(10, {message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(100, {message: CreateOfferValidationMessage.title.maxLength})
  public title: string;

  @MinLength(20, {message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(1024, {message: CreateOfferValidationMessage.title.maxLength})
  public description: string;

  @IsDateString({}, {message: CreateOfferValidationMessage.date.invalidFormat})
  public date: string;

  @IsIn(Object.values(SixCities).map((city) => city.name), {message: CreateOfferValidationMessage.city.invalidValue})
  public city: string;

  @IsString({message: CreateOfferValidationMessage.stringType.type})
  public previewImage: string;

  @IsArray({message: CreateOfferValidationMessage.images.invalidFormat})
  @ArrayMinSize(6, {message: CreateOfferValidationMessage.images.length})
  @ArrayMaxSize(6, {message: CreateOfferValidationMessage.images.length})
  public images: string[];

  @IsBoolean({message: CreateOfferValidationMessage.isPremium.type})
  public isPremium: boolean;

  @IsInt({message: CreateOfferValidationMessage.intType.type})
  @Min(1, {message: CreateOfferValidationMessage.bedrooms.length})
  @Max(8, {message: CreateOfferValidationMessage.bedrooms.length})
  public bedrooms: number;

  @IsInt({message: CreateOfferValidationMessage.intType.type})
  @Min(1, {message: CreateOfferValidationMessage.maxAdults.length})
  @Max(10, {message: CreateOfferValidationMessage.maxAdults.length})
  public maxAdults: number;

  public host?: string;

  @IsIn(PLACE_TYPES, {message: CreateOfferValidationMessage.type.wrongValue})
  public type: string;

  @IsInt({message: CreateOfferValidationMessage.intType.type})
  @Min(100, {message: CreateOfferValidationMessage.price.value})
  @Max(100000, {message: CreateOfferValidationMessage.price.value})
  public price: number;

  @IsArray()
  @IsIn(PLACE_BENEFITS, {message: CreateOfferValidationMessage.goods.wrongValue, each: true})
  public goods: string[];

  @IsLatitude({message: CreateOfferValidationMessage.intType.type})
  public offerLatitude: number;

  @IsLongitude({message: CreateOfferValidationMessage.intType.type})
  public offerLongitude: number;

  @IsInt({message: CreateOfferValidationMessage.intType.type})
  public offerZoom: number;
}

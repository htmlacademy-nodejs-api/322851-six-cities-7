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
  IsOptional,
  IsLatitude,
  IsLongitude,
  ArrayMaxSize,
  ArrayMinSize} from 'class-validator';
import { CreateOfferValidationMessage } from './create-offer.messages.js';
import { PLACE_BENEFITS, PLACE_TYPES, SixCities } from '../../../const.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, {message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(100, {message: CreateOfferValidationMessage.title.maxLength})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: CreateOfferValidationMessage.title.minLength})
  @MaxLength(1024, {message: CreateOfferValidationMessage.title.maxLength})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: CreateOfferValidationMessage.date.invalidFormat})
  public date?: string;

  @IsOptional()
  @IsIn(Object.values(SixCities).map((city) => city.name), {message: CreateOfferValidationMessage.city.invalidValue})
  public city?: string;

  @IsOptional()
  @IsString({message: CreateOfferValidationMessage.stringType.type})
  public previewImage?: string;

  @IsOptional()
  @IsArray({message: CreateOfferValidationMessage.images.invalidFormat})
  @ArrayMaxSize(6, {message: CreateOfferValidationMessage.images.length})
  @ArrayMinSize(6, {message: CreateOfferValidationMessage.images.length})
  public images?: string[];

  @IsOptional()
  @IsBoolean({message: CreateOfferValidationMessage.isPremium.type})
  public isPremium?: boolean;

  @IsOptional()
  @IsInt({message: CreateOfferValidationMessage.intType.type})
  @Min(1, {message: CreateOfferValidationMessage.bedrooms.length})
  @Max(8, {message: CreateOfferValidationMessage.bedrooms.length})
  public bedrooms?: number;

  @IsOptional()
  @IsInt({message: CreateOfferValidationMessage.intType.type})
  @Min(1, {message: CreateOfferValidationMessage.maxAdults.length})
  @Max(10, {message: CreateOfferValidationMessage.maxAdults.length})
  public maxAdults?: number;

  @IsOptional()
  @IsIn(PLACE_TYPES, {message: CreateOfferValidationMessage.type.wrongValue})
  public type?: string;

  @IsOptional()
  @IsInt({message: CreateOfferValidationMessage.intType.type})
  @Min(100, {message: CreateOfferValidationMessage.price.value})
  @Max(100000, {message: CreateOfferValidationMessage.price.value})
  public price?: number;

  @IsOptional()
  @IsArray()
  @IsIn(PLACE_BENEFITS, {message: CreateOfferValidationMessage.goods.wrongValue, each: true})
  public goods?: string[];

  @IsOptional()
  @IsLatitude({message: CreateOfferValidationMessage.intType.type})
  public offerLatitude?: number;

  @IsOptional()
  @IsLongitude({message: CreateOfferValidationMessage.intType.type})
  public offerLongitude?: number;

  @IsOptional()
  @IsInt({message: CreateOfferValidationMessage.intType.type})
  public offerZoom?: number;
}

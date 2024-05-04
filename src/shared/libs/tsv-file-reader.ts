import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { Offer } from '../types/offer.type.js';
import { City } from '../types/city.type.js';
import { Location } from '../types/location.type.js';
import { User } from '../types/user.type.js';
import dayjs from 'dayjs';

export class TSVFileReader implements FileReader {
  private rawData = '';
  constructor(
    private readonly filename: string
  ) {}

  private validateRawData() {
    if (! this.rawData) {
      throw new Error('file was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      id,
      title,
      type,
      price,
      cityName,
      cityLatitude,
      cityLongitude,
      cityZoom,
      offerLatitude,
      offerLongitude,
      offerZoom,
      isFavorite,
      isPremium,
      raiting,
      previewImage,
      images,
      description,
      bedrooms,
      maxAdults,
      goods,
      userName,
      password,
      email,
      isPro,
      avatar,
      comments,
      date
    ] = line.split('\t');

    return {
      id,
      title,
      description,
      city: this.parseCity(cityName, cityLatitude, cityLongitude, cityZoom),
      date: (date) ? date : dayjs().toISOString(),
      previewImage,
      images: images.split(';'),
      isFavorite: this.parseBoolean(isFavorite),
      isPremium: this.parseBoolean(isPremium),
      rating: parseFloat(raiting),
      type,
      bedrooms: parseInt(bedrooms, 10),
      maxAdults: parseInt(maxAdults, 10),
      price: parseInt(price, 10),
      goods: goods.split(','),
      host: this.parseUser(userName, password, email, isPro, avatar),
      comments: parseInt(comments, 10),
      location: this.parseLocation(offerLatitude, offerLongitude, offerZoom)
    };
  }

  private parseCity(cityName: string, cityLatitude: string, cityLongitude: string, cityZoom: string): City {
    return {
      name: cityName,
      location: this.parseLocation(cityLatitude, cityLongitude, cityZoom)
    };
  }

  private parseLocation(latitude: string, longitude: string, zoom: string): Location {
    console.log(latitude, longitude);
    return {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      zoom: parseInt(zoom, 10)
    };
  }

  private parseBoolean(status: string): boolean {
    return status === 'true';
  }

  private parseUser(name: string, password: string, email: string, isPro:string, avatar: string): User {
    return {
      name,
      password,
      email,
      isPro: this.parseBoolean(isPro),
      avatar: avatar ?? null
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, 'utf-8');
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}

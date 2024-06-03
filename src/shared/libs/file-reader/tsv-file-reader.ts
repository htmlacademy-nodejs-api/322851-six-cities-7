import { FileReader } from './file-reader.interface.js';
import { createReadStream } from 'node:fs';
import { Offer, City, Location, User } from '../../types/index.js';
import dayjs from 'dayjs';
import { Setting } from '../../const.js';
import { EventEmitter } from 'node:events';

export class TSVFileReader extends EventEmitter implements FileReader {
  private chunkSize = Setting.CHUNK_SIZE;

  constructor(
    private readonly filename: string
  ) {
    super();
  }

  private parseLineToOffer(line: string): Offer {
    const [
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
      isPremium,
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
      date
    ] = line.split('\t');

    const { longitude, latitude, zoom } = this.parseLocation(offerLatitude, offerLongitude, offerZoom);

    return {
      title,
      description,
      city: this.parseCity(cityName, cityLatitude, cityLongitude, cityZoom),
      date: (date) ? date : dayjs().toISOString(),
      previewImage,
      images: images.split(';'),
      isPremium: this.parseBoolean(isPremium),
      type,
      bedrooms: parseInt(bedrooms, 10),
      maxAdults: parseInt(maxAdults, 10),
      price: parseInt(price, 10),
      goods: goods.split(','),
      host: this.parseUser(userName, password, email, isPro, avatar),
      offerLatitude: latitude,
      offerLongitude: longitude,
      offerZoom: zoom
    };
  }

  private parseCity(cityName: string, cityLatitude: string, cityLongitude: string, cityZoom: string): City {
    const {longitude, latitude, zoom } = this.parseLocation(cityLatitude, cityLongitude, cityZoom);
    return {
      name: cityName,
      cityLatitude: latitude,
      cityLongitude: longitude,
      cityZoom: zoom
    };
  }

  private parseLocation(latitude: string, longitude: string, zoom: string): Location {
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
      password: password,
      email,
      isPro: this.parseBoolean(isPro),
      avatar: avatar ?? null
    };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {encoding: 'utf-8', highWaterMark: this.chunkSize});

    let remainingData = '';
    let nextLineIndex = -1;
    let lineCount = 0;

    for await (const chunk of readStream) {

      remainingData += chunk.toString();
      nextLineIndex = remainingData.indexOf('\n');
      while (nextLineIndex >= 0) {
        const line = remainingData.slice(0, nextLineIndex);
        remainingData = remainingData.slice(nextLineIndex + 1);
        lineCount += 1;
        nextLineIndex = remainingData.indexOf('\n');

        const parsedOffer = this.parseLineToOffer(line);


        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });

      }
    }

    this.emit('end', lineCount);
  }
}

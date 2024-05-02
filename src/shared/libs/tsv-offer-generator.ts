import { OFFER_GOODS, OFFER_TYPES, Setting, SixCities } from '../const.js';
import { getRandomInteger, getRandomSubArray } from '../helpers/common.js';
import { MockServerData } from '../types/mock-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(
    private readonly mockData: MockServerData
  ) {}

  generate(): string {
    const id = faker.database.mongodbObjectId;
    const title = getRandomSubArray(this.mockData.api.titles, Setting.COMMON_MIN_VALUE);
    const description = getRandomSubArray(this.mockData.api.descriptions, Setting.COMMON_MIN_VALUE);
    const date = dayjs(faker.date.recent()).toISOString();
    const city = getRandomSubArray(Object.values(SixCities), Setting.COMMON_MIN_VALUE);
    const previewImage = getRandomSubArray(this.mockData.api.previewImages, Setting.COMMON_MIN_VALUE);
    const images = getRandomSubArray(this.mockData.api.images, Setting.OFFER_IMAGES_COUNT).join(';');
    const isFavorite = faker.datatype.boolean();
    const isPremium = faker.datatype.boolean();
    const rating = getRandomInteger(Setting.MINRAITING, Setting.MAXRAITING * 10) / 10;
    const type = getRandomSubArray(OFFER_TYPES, Setting.COMMON_MIN_VALUE);
    const bedrooms = getRandomInteger(Setting.MINBEDROOMS, Setting.MAXBEDROOMS);
    const maxAdults = getRandomInteger(Setting.MINADULTS, Setting.MAXADULTS);
    const price = getRandomInteger(Setting.MINPRICE, Setting.MAXPRICE);
    const goods = getRandomSubArray(OFFER_GOODS).join(',');
    const host = {
      name: getRandomSubArray(this.mockData.api.userNames, Setting.COMMON_MIN_VALUE),
      email: getRandomSubArray(this.mockData.api.emails, Setting.COMMON_MIN_VALUE),
      avatar: getRandomSubArray(this.mockData.api.avatars, Setting.COMMON_MIN_VALUE),
      password: getRandomSubArray(this.mockData.api.passwords, Setting.COMMON_MIN_VALUE),
      isPro: faker.datatype.boolean()
    };
    const comments = getRandomInteger(0, Setting.MAX_COMMENTS_VALUE);
    const location = {
      latitude: faker.location.latitude,
      longitude: faker.location.longitude,
      zoom: Setting.OFFER_LOCATION_ZOOM
    } ;

    return [
      id,
      title,
      description,
      date,
      city,
      previewImage,
      images,
      isFavorite,
      isPremium,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      host,
      comments,
      location
    ].join('\t');
  }
}

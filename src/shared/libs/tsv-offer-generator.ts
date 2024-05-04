import { OFFER_GOODS, OFFER_TYPES, Setting, SixCities } from '../const.js';
import { getRandomInteger, getRandomSubArray, getRanndomElement } from '../helpers/common.js';
import { MockServerData } from '../types/mock-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(
    private readonly mockData: MockServerData
  ) {}

  generate(): string {
    const id = faker.database.mongodbObjectId();
    const title = getRanndomElement(this.mockData.titles);
    const description = getRanndomElement(this.mockData.descriptions);
    const date = dayjs(faker.date.recent()).toISOString();
    const city = getRanndomElement(Object.values(SixCities));
    const previewImage = getRanndomElement(this.mockData.previewImages);
    const images = getRandomSubArray(this.mockData.images, Setting.OFFER_IMAGES_COUNT).join(';');
    const isFavorite = faker.datatype.boolean();
    const isPremium = faker.datatype.boolean();
    const rating = getRandomInteger(Setting.MINRAITING, Setting.MAXRAITING * 10) / 10;
    const type = getRanndomElement(OFFER_TYPES);
    const bedrooms = getRandomInteger(Setting.MINBEDROOMS, Setting.MAXBEDROOMS);
    const maxAdults = getRandomInteger(Setting.MINADULTS, Setting.MAXADULTS);
    const price = getRandomInteger(Setting.MINPRICE, Setting.MAXPRICE);
    const goods = getRandomSubArray(OFFER_GOODS).join(',');
    const host = {
      name: getRanndomElement(this.mockData.userNames),
      email: getRanndomElement(this.mockData.emails),
      avatar: getRanndomElement(this.mockData.avatars),
      password: getRanndomElement(this.mockData.passwords),
      isPro: faker.datatype.boolean()
    };
    const comments = getRandomInteger(0, Setting.MAX_COMMENTS_VALUE);
    const location = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      zoom: Setting.OFFER_LOCATION_ZOOM
    } ;

    return [
      id,
      title,
      type,
      price,
      city.name,
      city.location.latitude,
      city.location.longitude,
      city.location.zoom,
      location.latitude,
      location.longitude,
      location.zoom,
      isFavorite,
      isPremium,
      rating,
      previewImage,
      images,
      description,
      bedrooms,
      maxAdults,
      goods,
      host.name,
      host.password,
      host.email,
      host.isPro,
      host.avatar,
      comments,
      date
    ].join('\t');
  }
}

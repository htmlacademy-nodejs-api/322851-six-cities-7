import { OFFER_GOODS, OFFER_TYPES, Setting, SixCities } from '../../const.js';
import { getRandomInteger, getRandomSubArray, getRanndomElement } from '../../helpers/common.js';
import { MockServerData } from '../../types/index.js';
import { OfferGenerator } from './offer-generator.interface.js';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(
    private readonly mockData: MockServerData
  ) {}

  generate(): string {
    const title = getRanndomElement(this.mockData.titles);
    const description = getRanndomElement(this.mockData.descriptions);
    const date = dayjs(faker.date.recent()).toISOString();
    const city = getRanndomElement(Object.values(SixCities));
    const previewImage = getRanndomElement(this.mockData.previewImages);
    const images = getRandomSubArray(this.mockData.images, Setting.OFFER_IMAGES_COUNT).join(';');
    const isPremium = faker.datatype.boolean();
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
    const location = {
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      zoom: Setting.OFFER_LOCATION_ZOOM
    } ;

    return [
      title,
      type,
      price,
      city.name,
      city.latitude,
      city.longitude,
      city.zoom,
      location.latitude,
      location.longitude,
      location.zoom,
      isPremium,
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
      date
    ].join('\t');
  }
}

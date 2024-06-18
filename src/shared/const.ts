const SixCities = {
  PARIS: {
    name: 'Paris',
    latitude: 48.85661,
    longitude: 2.351499,
    zoom: 8

  },
  COLOGNE: {
    name: 'Cologne',
    latitude: 50.938361,
    longitude: 6.959974,
    zoom: 8
  },
  BRUSSELS: {
    name: 'Brussels',
    latitude: 50.846557,
    longitude: 4.351697,
    zoom: 8

  },
  AMSTERDAM: {
    name: 'Amsterdam',
    latitude: 52.370216,
    longitude: 4.895168,
    zoom: 8

  },
  HAMBURG: {
    name: 'Hamburg',
    latitude: 53.550341,
    longitude: 10.000654,
    zoom: 8

  },
  DUSSELDORF: {
    name: 'Dusseldorf',
    latitude: 51.225402,
    longitude: 6.776314,
    zoom: 8

  }
} as const;

const UPLOAD_ROUTE = '/upload';
const STATIC_ROUTE = '/static';

const Setting = {
  MAXPRICE: 100000,
  MINPRICE: 100,
  MAXADULTS: 10,
  MINADULTS: 1,
  MAXBEDROOMS: 8,
  MINBEDROOMS: 1,
  MAXRAITING: 5,
  MINRAITING: 1,
  OFFER_IMAGES_COUNT: 6,
  MAX_COMMENTS_COUNT: 50,
  MAX_OFFERS_COUNT: 50,
  OFFER_LOCATION_ZOOM: 16,
  PREMIUM_OFFERS_COUNT: 3,
  CHUNK_SIZE: 16384,
  DEFAULT_AVATAR_FILE_NAME: 'default-avatar.jpg'
} as const;

enum DatabaseSetting {
  RETRY_COUNT = 5,
  RETRY_TIMEOUT = 1000,
  DEFAULT_DB_PORT = '27017'
}

const OFFER_TYPES = ['apartment', 'house', 'room', 'hotel'];
const OFFER_GOODS = ['Breakfast, Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'];

const DEFAULT_STATIC_IMAGES = [
  Setting.DEFAULT_AVATAR_FILE_NAME,
  'default-image-01.jpg',
  'default-image-02.jpg',
  'default-image-03.jpg',
  'default-image-04.jpg',
  'default-image-05.jpg',
  'default-image-06.jpg',
  'default-preview.jpg'
];

const STATIC_RESOURCE_FIELDS = [
  'avatar',
  'images',
  'previewImage'
];


enum JWTtSetting {
  ALGORYTHM = 'HS256',
  EXPIRATION_TIME = '2d'
}

export {
  SixCities,
  OFFER_TYPES,
  OFFER_GOODS,
  Setting,
  DatabaseSetting,
  JWTtSetting,
  STATIC_ROUTE,
  UPLOAD_ROUTE,
  DEFAULT_STATIC_IMAGES,
  STATIC_RESOURCE_FIELDS
};

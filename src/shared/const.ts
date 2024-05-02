const SixCities = {
  PARIS: {
    name: 'Paris',
    location: {
      latitude: 48.85661,
      longitude: 2.351499,
      zoom: 8
    }
  },
  COLOGNE: {
    name: 'Cologne',
    location: {
      latitude: 50.938361,
      longitude: 6.959974,
      zoom: 8
    }
  },
  BRUSSELS: {
    name: 'Brussels',
    location: {
      latitude: 50.846557,
      longitude: 4.351697,
      zoom: 8
    }
  },
  AMSTERDAM: {
    name: 'Amsterdam',
    location: {
      latitude: 52.370216,
      longitude: 4.895168,
      zoom: 8
    }
  },
  HAMBURG: {
    name: 'Hamburg',
    location: {
      latitude: 53.550341,
      longitude: 10.000654,
      zoom: 8
    }
  },
  DUSSELDORF: {
    name: 'Dusseldorf',
    location: {
      latitude: 51.225402,
      longitude: 6.776314,
      zoom: 8
    }
  }
} as const;

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
  COMMON_MIN_VALUE: 1,
  MAX_COMMENTS_VALUE: 50,
  OFFER_LOCATION_ZOOM: 16
} as const;

const OFFER_TYPES = ['apartment', 'house', 'room', 'hotel'];
const OFFER_GOODS = ['Breakfast, Air conditioning', 'Laptop friendly workspace', 'Baby seat', 'Washer', 'Towels', 'Fridge'];

export {
  SixCities,
  OFFER_TYPES,
  OFFER_GOODS,
  Setting
};

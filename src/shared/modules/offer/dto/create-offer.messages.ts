import { SixCities } from '../../../const.js';

export const CreateOfferValidationMessage = {
  title: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100'
  },

  description: {
    minLength: 'Minimum title length must be 20',
    maxLength: 'Maximum title length must be 1024'
  },

  date: {
    invalidFormat: 'Date must be a valid ISO date',
  },

  city: {
    invalidValue: `City field must be from ${Object.values(SixCities).map((city) => city.name)}`,
  },

  images: {
    invalidFormat: 'Field images must be an array',
    length: 'You should download 6 photos'
  },

  isPremium: {
    type: 'Field must be boolean type',
  },

  intType: {
    type: 'Field must be an integer'
  },

  bedrooms: {
    length: 'Should be in the range from 1 to 8'
  },

  maxAdults: {
    length: 'Should be in the range  from 1 to 10'
  },

  host: {
    invalidId: 'host field must be a valid id'
  },

  type: {
    wrongValue: 'The value should be of: apartment, house, room, hotel'
  },

  price: {
    value: 'Price should be in the range from 100 to 100000'
  },

  goods: {
    wrongValue: 'This value is not implemented'
  },

  stringType: {
    type: 'Field must be a string'
  }
} as const;

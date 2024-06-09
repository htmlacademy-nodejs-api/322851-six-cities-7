
export const UserValidationMessage = {
  email: {
    email: 'Not valid Email'
  },

  password: {
    minLength: 'Password min length is 6',
    maxLength: 'Password max length is 12'
  },

  name: {
    minLength: 'Name min length is 1',
    maxLength: 'Name max length is 15'
  },

  avatar: {
    type: 'Should be string'
  },

  isPro: {
    type: 'Should be boolean'
  },
} as const;

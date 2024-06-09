export const CommentValidationMessage = {
  date: {
    dateValidation: 'Date must be a valid ISO date'
  },

  comment: {
    minLength: 'Minimum comment length must be 5',
    maxLength: 'Maximum comment length must be 1024'
  },

  rating: {
    min: 'Minimum value must be 1',
    max: 'Maximum value must be 5'
  },

  user: {
    objectId: 'User field must be a valid id'
  }
} as const;

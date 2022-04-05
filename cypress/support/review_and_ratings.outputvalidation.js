import { PRODUCTS } from './common/utils.js'

export default {
  testCase1: {
    title: 'Enable Anonymous review with no admin approval',
    product: PRODUCTS.onion,
    configuration: {
      allowAnonymousReviews: true,
      requireApproval: false,
      defaultStarsRating: '3',
    },
    anonymousUser1: {
      name: 'syed',
      line: 'Test',
      location: 'California', // optional
      email: 'syed@bitcot.com',
      rating: 3,
      review: 'Good',
      average: 3,
    },
    anonymousUser2: {
      name: 'Syed',
      line: 'Test',
      location: null,
      email: 'syed@bitcot.com',
      rating: 5,
      review: 'Excellent Product',
      average: 4,
    },
    user1: {
      name: 'Syed',
      line: 'Bottom Line',
      location: null,
      rating: 5,
      review: 'Excellent Product',
      average: 4.33,
    },
  },
  testCase2: {
    product: PRODUCTS.cauliflower,
    postalCode: '33180',
    title: 'Disable Anonymous review with no admin approval',
    configuration: {
      allowAnonymousReviews: false,
      requireApproval: false,
      defaultStarsRating: '4',
    },
    user1: {
      name: 'Syed',
      line: 'Bottom Line',
      location: null,
      rating: 4,
      review: 'Excellent Product',
      average: 4,
      verified: true,
    },
  },
  testCase3: {
    product: PRODUCTS.cauliflower,
    postalCode: '33180',
    title: 'Enable Anonymous review with admin approval',
    configuration: {
      allowAnonymousReviews: true,
      requireApproval: true,
      defaultStarsRating: '4',
    },
    anonymousUser1: {
      name: 'syed',
      line: 'Test',
      location: 'California', // optional
      email: 'syed@bitcot.com',
      rating: 3,
      review: 'Good',
      average: 3,
    },
    user1: {
      name: 'Syed',
      line: 'Bottom Line',
      location: null,
      rating: 4,
      review: 'Excellent Product',
      average: 4,
      verified: true,
    },
  },
}

import {
  addReviewAPI,
  deleteReviewAPI,
  getProductRatingsAPI,
  retriveReviewAPI,
  retriveReviewsListAPI,
} from '../support/review_and_ratings.apis'
import { testCase1 } from '../support/review_and_ratings.outputvalidation.js'

const { productId, anonymousUser1 } = testCase1

describe('Revies testcases', () => {
  getProductRatingsAPI(productId)

  addReviewAPI(productId, anonymousUser1)

  retriveReviewAPI(productId)

  retriveReviewsListAPI(productId)

  deleteReviewAPI(productId)
})

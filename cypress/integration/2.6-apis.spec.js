import {
  addReviewAPI,
  deleteReview,
  deleteReviews,
  getProductRatingsAPI,
  retriveReviewAPI,
  retriveReviewsListAPI,
} from '../support/review_and_ratings.apis'
import { testCase5 } from '../support/review_and_ratings.outputvalidation.js'

const { productId1, productId2, anonymousUser1, anonymousUser2 } = testCase5

describe('Revies testcases', () => {
  addReviewAPI(productId1, anonymousUser1)
  getProductRatingsAPI(productId1)
  retriveReviewAPI(productId1, anonymousUser1)
  retriveReviewsListAPI(productId1)
  addReviewAPI(productId1, anonymousUser1, true)
  deleteReview(anonymousUser1)
  addReviewAPI(productId1, anonymousUser1)
  addReviewAPI(productId2, anonymousUser2)
  deleteReviews(anonymousUser2, anonymousUser1)
})

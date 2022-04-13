import {
  addReviewAPI,
  deleteReview,
  deleteReviews,
  getProductRatingsAPI,
  retrieveReviewAPI,
  retrieveReviewsListAPI,
  editReview,
} from '../support/review_and_ratings.apis'
import { testCase5 } from '../support/review_and_ratings.outputvalidation.js'
import { testSetup } from '../support/common/support.js'

const { productId1, productId2, anonymousUser1, anonymousUser2 } = testCase5
const patchReviewEnv = 'patchReviewEnv'

describe('Reviews REST API testcases', () => {
  testSetup(false)
  addReviewAPI(productId1, anonymousUser1)
  getProductRatingsAPI(productId1)
  retrieveReviewAPI(productId1, anonymousUser1)
  retrieveReviewsListAPI(productId1)
  addReviewAPI(productId1, anonymousUser1, true)
  deleteReview(anonymousUser1)
  addReviewAPI(productId2, anonymousUser2)
  addReviewAPI(productId1, anonymousUser1)
  retrieveReviewAPI(productId2, anonymousUser2)
  editReview(anonymousUser2, patchReviewEnv)
  deleteReviews(anonymousUser2, anonymousUser1, patchReviewEnv)
})

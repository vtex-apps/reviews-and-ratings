import {
  addReviewAPI,
  deleteReview,
  deleteReviews,
  getProductRatingsAPI,
  retrieveReviewAPI,
  retrieveReviewsListAPI,
  editReview,
  addReviewsAPI,
  invalidPayloadInAddReview,
} from '../support/api_testcase.js'
import { testCase5 } from '../support/outputvalidation.js'
import { loginViaCookies, updateRetry } from '../support/common/support.js'
import {
  graphql,
  getReviews,
  performDeleteReviews,
} from '../support/graphql_testcase.js'

const {
  productId1,
  productId2,
  anonymousUser1,
  anonymousUser2,
  addReviews,
  invalidReview,
  invalidReviews,
} = testCase5

const patchReviewEnv = 'patchReviewEnv'
const addReviewsEnv = 'addReviewsEnv'

describe('Reviews REST API testcases', () => {
  loginViaCookies({ storeFrontCookie: false })

  for (const productId of [productId1, productId2]) {
    it(`Delete all the for product ${productId}`, updateRetry(5), () => {
      graphql(getReviews(productId), resp => {
        const { reviews } = resp.body.data

        if (reviews) {
          const ids = reviews.data.map(({ id }) => id)

          performDeleteReviews(ids)
        }
      })
    })
  }

  for (const review of invalidReview) {
    invalidPayloadInAddReview(review)
  }

  for (const review of invalidReviews) {
    invalidPayloadInAddReview(review, true)
  }

  addReviewAPI(productId1, anonymousUser1)
  addReviewAPI(productId2, anonymousUser2)
  addReviewsAPI(addReviews, addReviewsEnv)
  addReviewAPI(productId1, anonymousUser1, true)
  getProductRatingsAPI(productId1)
  retrieveReviewAPI(productId1, anonymousUser1)
  retrieveReviewsListAPI(productId1)
  deleteReview(anonymousUser1)
  retrieveReviewAPI(productId2, anonymousUser2)
  editReview(anonymousUser2, patchReviewEnv)
  addReviewAPI(productId1, anonymousUser1)
  deleteReviews(anonymousUser2, anonymousUser1, {
    patchReviewEnv,
    addReviewsEnv,
  })
})

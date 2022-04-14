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
import { testSetup, updateRetry } from '../support/common/support.js'
import { graphql, getReviews } from '../support/graphql_queries.js'
import { performDeleteReviews } from '../support/graphql_testcase.js'

const { productId1, productId2, anonymousUser1, anonymousUser2 } = testCase5
const patchReviewEnv = 'patchReviewEnv'

describe('Reviews REST API testcases', () => {
  testSetup(false)

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

  addReviewAPI(productId1, anonymousUser1)
  addReviewAPI(productId2, anonymousUser2)
  addReviewAPI(productId1, anonymousUser1, true)
  getProductRatingsAPI(productId1)
  retrieveReviewAPI(productId1, anonymousUser1)
  retrieveReviewsListAPI(productId1)
  deleteReview(anonymousUser1)
  retrieveReviewAPI(productId2, anonymousUser2)
  editReview(anonymousUser2, patchReviewEnv)
  addReviewAPI(productId1, anonymousUser1)
  deleteReviews(anonymousUser2, anonymousUser1, patchReviewEnv)
})

import {
  addReviewAPI,
  deleteReview,
  deleteReviews,
  getProductRatingsAPI,
  retriveReviewAPI,
  retriveReviewsListAPI,
} from '../support/review_and_ratings.apis'
import {
  testCase5,
  reviewsViaAPI,
} from '../support/review_and_ratings.outputvalidation.js'

const { productId1, productId2, anonymousUser1, anonymousUser2 } = testCase5
const { reviewapi1, reviewapi2 } = reviewsViaAPI

describe('Revies testcases', () => {
  getProductRatingsAPI(productId1)

  addReviewAPI(
    { product: productId1, reviewapienv: reviewapi1 },
    anonymousUser1
  )

  retriveReviewAPI({ product: productId1, reviewapienv: reviewapi1 })

  retriveReviewsListAPI(productId1)

  addReviewAPI(
    { product: productId1, reviewapienv: reviewapi1 },
    anonymousUser1,
    true
  )

  deleteReview({ product: productId1, reviewapienv: reviewapi1 })

  addReviewAPI(
    { product: productId2, reviewapienv: reviewapi2 },
    anonymousUser2
  )

  addReviewAPI(
    { reviewapienv: reviewapi1, product: productId1 },
    anonymousUser1
  )

  deleteReviews()
})

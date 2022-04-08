import { testSetup } from '../support/common/support.js'
import {
  graphql,
  getShopperIdQuery,
  ValidateShopperIdResponse,
  validateGetReviewResponse,
  getReview,
  getReviews,
  getAverageRatingByProductId,
  totalReviewsByProductId,
  reviewsByProductId,
  validateGetReviewsResponse,
  validateReviewsByProductResponse,
  validateAverageRatingByProductResponse,
  validateTotalReviewsByProductResponse,
} from '../support/graphql_queries.js'
import { testCase5 } from '../support/review_and_ratings.outputvalidation.js'

const { productId1, anonymousUser1 } = testCase5

describe('Graphql queries', () => {
  testSetup()
  it('Verify reviews by shopperId query', () => {
    graphql(getShopperIdQuery(), ValidateShopperIdResponse)
  })

  it('Verify get review query', () => {
    cy.getReviewItems().then(review => {
      graphql(getReview(review[anonymousUser1.name]), validateGetReviewResponse)
    })
  })

  it('Verify get reviews query', () => {
    graphql(getReviews(), validateGetReviewsResponse)
  })

  it('Verify reviews of product by id query', () => {
    graphql(reviewsByProductId(productId1), validateReviewsByProductResponse)
  })

  it('Verify get average of product by id query', () => {
    graphql(
      getAverageRatingByProductId(productId1),
      validateAverageRatingByProductResponse
    )
  })

  it('Verify total reviews of product by id query', () => {
    graphql(
      totalReviewsByProductId(productId1),
      validateTotalReviewsByProductResponse
    )
  })
})

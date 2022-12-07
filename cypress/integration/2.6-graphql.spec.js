import { loginViaCookies, updateRetry } from '../support/common/support.js'
import {
  getShopperIdQuery,
  ValidateShopperIdResponse,
  getReview,
  getReviews,
  totalReviewsByProductId,
  reviewsByProductId,
  validateGetReviewsResponse,
  validateReviewsByProductResponse,
  validateTotalReviewsByProductResponse,
  getreviewByDateRangeQuery,
  ValidateGetreviewByDateRangeQueryResponse,
  gethasShopperReviewedQuery,
  ValidateHasShopperReviewedResponse,
  addReviewQuery,
  getAverageRatingByProductId,
  editReview,
  approveReviews,
} from '../support/graphql_testcase.js'
import { testCase6, testCase1 } from '../support/outputvalidation.js'
import { graphql } from '../support/common/graphql_utils.js'

const { anonymousUser1, anonymousUser2 } = testCase6
const { productId, title } = anonymousUser1
const reviewDateTimeEnv = 'reviewDateTimeEnv'
const APP = 'vtex.reviews-and-ratings'

describe('Graphql queries', () => {
  loginViaCookies({ storeFrontCookie: false })

  it('Verify adding review for product', updateRetry(2), () => {
    graphql(APP, addReviewQuery(anonymousUser1), response => {
      expect(response.body).to.not.have.own.property('errors')
      expect(response.body.data.newReview).to.not.equal(null)
      expect(response.body.data.newReview.id).to.contain('-')
      cy.setReviewItem(title, response.body.data.newReview.id)
    })
  })

  approveReviews(title)

  it('Verify reviews by shopperId query', updateRetry(2), () => {
    graphql(APP, getShopperIdQuery(), ValidateShopperIdResponse)
  })

  it('Verify total reviews of product by id query', updateRetry(2), () => {
    graphql(
      APP,
      totalReviewsByProductId(productId),
      validateTotalReviewsByProductResponse
    )
  })

  it('Verify reviews of product by id query', updateRetry(2), () => {
    graphql(
      APP,
      reviewsByProductId(productId),
      validateReviewsByProductResponse
    )
  })

  it('Verify get review for review created via graphql', updateRetry(2), () => {
    cy.getReviewItems().then(review => {
      graphql(APP, getReview(review[title]), response => {
        expect(response.body.data.review).to.not.equal(null)
      })
    })
  })

  it(
    'Verify edit review for review created via graphql',
    updateRetry(2),
    () => {
      cy.getReviewItems().then(review => {
        graphql(APP, editReview(review[title], anonymousUser2), response => {
          expect(response.body).to.not.have.own.property('errors')
          expect(response.body.data.review).to.not.equal(null)
        })
      })
    }
  )

  it('Verify hasShopperReviewed', updateRetry(2), () => {
    graphql(
      APP,
      gethasShopperReviewedQuery(),
      ValidateHasShopperReviewedResponse
    )
  })

  it('Verify get review for review created via UI', updateRetry(2), () => {
    cy.getReviewItems().then(review => {
      graphql(
        APP,
        getReview(review[testCase1.anonymousUser1.name]),
        response => {
          expect(response.body.data.review).to.not.equal(null)
          cy.setReviewItem(
            reviewDateTimeEnv,
            response.body.data.review.reviewDateTime
          )
        }
      )
    })
  })

  it('Verify get reviews query', updateRetry(2), () => {
    cy.getReviewItems().then(review => {
      graphql(APP, getReviews(review[productId]), validateGetReviewsResponse)
    })
  })

  it('Verify reviewByDateRange query', updateRetry(2), () => {
    cy.getReviewItems().then(review => {
      graphql(
        APP,
        getreviewByDateRangeQuery(review[reviewDateTimeEnv]),
        ValidateGetreviewByDateRangeQueryResponse
      )
    })
  })

  it('Verify get average of product by id query', updateRetry(4), () => {
    cy.addDelayBetweenRetries(2000)
    graphql(APP, getAverageRatingByProductId(productId), response => {
      expect(response.body).to.not.have.own.property('errors')
      expect(response.body.data.averageRatingByProductId.average).to.not.equal(
        null
      )
      expect(response.body.data.averageRatingByProductId.average).to.equal(
        anonymousUser2.rating
      )
    })
  })
})

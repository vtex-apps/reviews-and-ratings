import { loginViaCookies, updateRetry } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { testCase3 } from '../support/review_and_ratings.outputvalidation'
import { verifyFilter, verifiedReviewTestCase } from '../support/testcase.js'
import { reviewsAndRatingsConstants } from '../support/reviews_and_ratings.constants.js'
import {
  deleteReviews,
  verifyReviewIsDeleted,
} from '../support/graphql_testcase.js'

const { title, configuration, product, anonymousUser1 } = testCase3

describe(`${title} - Anonymous User`, () => {
  loginViaCookies({ storeFrontCookie: false })
  updateSettings(title, configuration)
  it('Adding review to product with location', updateRetry(2), () => {
    cy.openStoreFront()
    cy.addReview(product, configuration.defaultStarsRating, anonymousUser1)
  })

  verifiedReviewTestCase(testCase3, false)
  verifyFilter(reviewsAndRatingsConstants.oneStar, false)
  verifyFilter(reviewsAndRatingsConstants.fourStars, true)
  deleteReviews(anonymousUser1.name)
  verifyReviewIsDeleted(anonymousUser1.name)
})

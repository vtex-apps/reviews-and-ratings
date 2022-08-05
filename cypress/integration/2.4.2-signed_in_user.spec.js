import {
  loginViaCookies,
  updateRetry,
  preserveCookie,
} from '../support/common/support.js'
import { testCase4 } from '../support/outputvalidation.js'
import { updateSettings } from '../support/graphql_testcase.js'
import {
  verifiedReviewTestCase,
  reviewTestCase,
  verifySorting,
} from '../support/testcase.js'
import { reviewsAndRatingsConstants } from '../support/constants.js'

const { title, configuration, product, user1 } = testCase4

describe(`${title} - Signed In User`, () => {
  loginViaCookies()

  updateSettings(title, configuration)

  it('Adding review to product with location', updateRetry(2), () => {
    cy.openStoreFront(true)
    cy.addReview(product, configuration.defaultStarsRating, user1)
  })
  verifiedReviewTestCase(testCase4, true)
  verifySorting(reviewsAndRatingsConstants.highRated)
  reviewTestCase(testCase4, true)
  preserveCookie()
})

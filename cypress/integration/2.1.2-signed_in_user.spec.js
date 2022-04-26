import {
  testSetup,
  updateRetry,
  preserveCookie,
} from '../support/common/support.js'
import { approveReviews } from '../support/graphql_testcase.js'
import { testCase1 } from '../support/review_and_ratings.outputvalidation.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { reviewTestCase } from '../support/testcase.js'

const { title, configuration, product, anonymousUser1, anonymousUser2, user1 } =
  testCase1

describe(title, () => {
  testSetup(false)
  updateSettings(title, configuration)

  describe(`Signed in User`, () => {
    testSetup()

    it('Adding review to product with location', updateRetry(2), () => {
      cy.openStoreFront(true)
      cy.addReview(product, configuration.defaultStarsRating, user1)
    })

    // If we disable admin approval, review been shown to UI
    // but review status is still pending so approving it via graphql
    approveReviews(anonymousUser1.name, anonymousUser2.name, user1.name)
    reviewTestCase(testCase1, true)
    preserveCookie()
  })
})

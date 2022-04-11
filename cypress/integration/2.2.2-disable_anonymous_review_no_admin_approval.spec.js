import { testSetup, updateRetry } from '../support/common/support.js'
import { testCase2 } from '../support/review_and_ratings.outputvalidation'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { approveReviews } from '../support/graphql_testcase.js'

const { title, configuration, product, user1 } = testCase2

describe(title, () => {
  testSetup(false)

  updateSettings(title, configuration)

  describe('Add review in ordered product', () => {
    testSetup()

    it(
      'Go to product detail page, verify default stars and add review',
      updateRetry(2),
      () => {
        cy.openStoreFront(true)
        cy.addReview(product, configuration.defaultStarsRating, user1)
      }
    )
  })

  // If we disable admin approval, review been shown to UI
  // but review status is still pending so approving it via graphql
  approveReviews(user1.name)
})

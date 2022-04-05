import { testSetup, updateRetry } from '../support/common/support.js'
import { testCase2 } from '../support/review_and_ratings.outputvalidation'

const { configuration, product, user1 } = testCase2

describe('Add review in ordered product', () => {
  testSetup()

  it(
    'Go to product detail page, verify default stars and added review should be verified',
    updateRetry(2),
    () => {
      cy.openStoreFront()
      cy.addReview(product, configuration.defaultStarsRating, user1)
    }
  )
})

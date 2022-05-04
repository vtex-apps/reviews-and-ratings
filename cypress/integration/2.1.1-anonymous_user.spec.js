import { testSetup, updateRetry } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { testCase1 } from '../support/review_and_ratings.outputvalidation.js'
import { reload } from '../support/utils.js'

const { title, configuration, product, anonymousUser1, anonymousUser2 } =
  testCase1

describe(title, () => {
  testSetup(false)
  updateSettings(title, configuration)

  describe('Anonymous User', () => {
    testSetup(false)
    it(
      'Anonymous user - Adding review to product with location',
      updateRetry(2),
      () => {
        cy.openStoreFront()
        cy.addReview(product, configuration.defaultStarsRating, anonymousUser1)
      }
    )

    it(
      'Anonymous user - Verify anonymous user is able to add review again without location',
      updateRetry(2),
      () => {
        reload(anonymousUser2)
        cy.addReview(product, configuration.defaultStarsRating, anonymousUser2)
      }
    )
  })
})

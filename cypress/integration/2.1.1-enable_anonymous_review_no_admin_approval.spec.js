import {
  testSetup,
  updateRetry,
  preserveCookie,
} from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { testCase1 } from '../support/review_and_ratings.outputvalidation.js'
import { reload } from '../support/utils.js'

const { title, configuration, product, anonymousUser1, anonymousUser2, user1 } =
  testCase1

describe(title, () => {
  updateSettings(title, configuration)

  describe('Anonymous User', () => {
    it('Adding review to product with location', updateRetry(2), () => {
      cy.openStoreFront(false)
      cy.addReview(product, configuration.defaultStarsRating, anonymousUser1)
    })

    it(
      'Verify anonymous user is able to add review again without location',
      updateRetry(2),
      () => {
        reload()
        cy.addReview(product, configuration.defaultStarsRating, anonymousUser2)
      }
    )
  })

  describe('Add review with Signed User', () => {
    testSetup()

    it('Verify average ratings for anonymous reviews', updateRetry(2), () => {
      cy.openStoreFront()
      cy.getAverageRating(anonymousUser2, product)
    })

    it('Adding review to product with location', updateRetry(2), () => {
      cy.addReview(product, configuration.defaultStarsRating, user1)
    })

    preserveCookie()
  })
})

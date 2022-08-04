import {
  loginViaCookies,
  preserveCookie,
  updateRetry,
} from '../support/common/support.js'
import { testCase1 } from '../support/review_and_ratings.outputvalidation.js'
import { verifyUserIsNotAbletoAddReviewAgain } from '../support/testcase.js'
import rrselectors from '../support/reviews_and_ratings.selectors.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'

const { product, user1, title, configuration } = testCase1

describe(title, () => {
  loginViaCookies({ storeFrontCookie: false })
  updateSettings(title, configuration)

  describe(`Verify review with Signed In User`, () => {
    loginViaCookies()

    it(
      'Added review should show immediately to the user',
      updateRetry(2),
      () => {
        cy.openStoreFront(true)
        cy.openProduct(product, true)
        cy.get(rrselectors.PostalCode, { timeout: 20000 }).should('be.visible')
        cy.get('span[class*=reviewComment]').contains(user1.line)
      }
    )

    it('Verify average ratings', () => {
      cy.getAverageRating(user1, product)
    })

    verifyUserIsNotAbletoAddReviewAgain()

    preserveCookie()
  })
})

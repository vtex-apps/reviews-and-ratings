import { loginViaCookies, preserveCookie } from '../support/common/support.js'
import { testCase2 } from '../support/review_and_ratings.outputvalidation.js'
import { verifyUserIsNotAbletoAddReviewAgain } from '../support/testcase.js'
import rrselectors from '../support/reviews_and_ratings.selectors.js'

const { product, user1, title } = testCase2

describe(`${title} - Verify review with Signed In User`, () => {
  loginViaCookies()

  it('Added review should show immediately to the user', () => {
    cy.openStoreFront(true)
    cy.openProduct(product, true)
    cy.get(rrselectors.PostalCode, { timeout: 20000 }).should('be.visible')
    cy.get('span[class*=reviewComment]').contains(user1.line)
  })

  it('Verify average ratings', () => {
    cy.getAverageRating(user1, product)
  })

  verifyUserIsNotAbletoAddReviewAgain()

  preserveCookie()
})

import { testSetup, preserveCookie } from '../support/common/support.js'
import { testCase1 } from '../support/review_and_ratings.outputvalidation.js'
import { verifyUserShouldBeAbletoAddReview } from '../support/testcase.js'
import rrselectors from '../support/reviews_and_ratings.selectors.js'

const { product, user1 } = testCase1

describe('Verify review with Signed User', () => {
  testSetup()

  it('Added review should show immediately to the user', () => {
    cy.openStoreFront()
    cy.openProduct(product)
    cy.get(rrselectors.PostalCode, { timeout: 20000 }).should('be.visible')
    cy.get('span[class*=reviewComment]').contains(user1.line)
  })

  it('Verify average ratings', () => {
    cy.getAverageRating(user1, product)
  })

  verifyUserShouldBeAbletoAddReview()

  preserveCookie()
})

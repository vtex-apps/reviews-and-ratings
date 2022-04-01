import { testSetup, updateRetry } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { PRODUCTS } from '../support/products.js'
import { testCase1 } from '../support/review_and_ratings.outputvalidation'

describe('Adding review testcase', () => {
  testSetup(false)

  updateSettings('testcase', {
    allowAnonymousReviews: true,
    requireApproval: false,
    defaultStarsRating: '3',
  })

  it('Adding review to product', updateRetry(2), () => {
    cy.intercept('**/rc.vtex.com.br/api/events').as('events')
    cy.visit('/')
    cy.wait('@events')
    cy.addReview(PRODUCTS.coconut, testCase1.anonymousUser1)
  })

  it('Verify average ratings', updateRetry(2), () => {
    cy.getAverageRating(testCase1.anonymousUser1)
  })

  it(
    'Verify anonymous user is able to add review again',
    updateRetry(2),
    () => {
      cy.addReview(PRODUCTS.coconut, testCase1.anonymousUser2)
    }
  )

  it('Verify average ratings', updateRetry(2), () => {
    cy.getAverageRating(testCase1.anonymousUser2)
  })
})

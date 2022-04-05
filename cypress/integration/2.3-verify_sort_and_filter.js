import { updateRetry } from '../../cy-runner/cypress-shared/support/common/support.js'
import { PRODUCTS } from '../support/products.js'
import { reviewsAndRatingsConstants } from '../support/reviews_and_ratings.constants.js'
import { verifyFilter, verifySorting } from '../support/review_and_ratings.js'

describe('Verify sorting and filtering', updateRetry(2), () => {
  //   testSetup(false)
  it('open product', () => {
    cy.openStoreFront(false)
    cy.openProduct(PRODUCTS.coconut, true)
  })
  verifyFilter(reviewsAndRatingsConstants.oneStar)
  verifyFilter(reviewsAndRatingsConstants.twoStars)
  verifyFilter(reviewsAndRatingsConstants.threeStars)
  verifyFilter(reviewsAndRatingsConstants.fourStars)
  verifyFilter(reviewsAndRatingsConstants.fiveStars)

  verifySorting(reviewsAndRatingsConstants.oldest)
  verifySorting(reviewsAndRatingsConstants.highRated)
  verifySorting(reviewsAndRatingsConstants.lowRated)
  verifySorting(reviewsAndRatingsConstants.recent)
})

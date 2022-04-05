import { updateRetry } from './common/support'
import { PRODUCTS } from './products'
import reviewsAndRatingsSelectors from './reviews_and_ratings.selectors'

export function verifySettings(type, enableSettings = false, login = false) {
  it(`${type} display stars in product rating inline`, updateRetry(2), () => {
    cy.openStoreFront(login)
    cy.openProduct(PRODUCTS.coconut, false)
    cy.verifyStarsInProductRatingInline(enableSettings)
  })

  it(
    `${type} display graph and verify graph content is ${
      enableSettings ? '' : 'not '
    }displayed for anonymous user`,
    updateRetry(2),
    () => {
      cy.openProduct(PRODUCTS.coconut, true)
      cy.verifyGraphUI(enableSettings)
    }
  )

  it(`${type} Display stars in product rating summary`, updateRetry(2), () => {
    // cy.openProduct(PRODUCTS.coconut, true)
    cy.verifyStarsInProductRatingSummary(enableSettings)
  })

  it(
    `${type} display total reviews number in product rating summary`,
    updateRetry(2),
    () => {
      // cy.openProduct(PRODUCTS.coconut, true)
      cy.verifyTotalReviewsInProductRatingSummary(enableSettings)
    }
  )

  it(
    `${type} display add review button in product rating summary`,
    updateRetry(2),
    () => {
      // cy.openProduct(PRODUCTS.coconut, true)
      cy.verifyAddReviewButtonInProductRatingSummary(enableSettings)
    }
  )
}

export function verifyFilter(filter = 'ALL') {
  it(`${filter} - Verify filtering`, updateRetry(2), () => {
    cy.get(reviewsAndRatingsSelectors.selectFilter).select(filter)
    cy.get(`.${reviewsAndRatingsSelectors.reviewCommentRating}`, {
      timeout: 30000,
    }).should('be.visible')
    cy.get('body').then(async $body => {
      const starsCount = $body.find(
        reviewsAndRatingsSelectors.reviewStarsCount
      ).length

      if (starsCount > 0) {
        expect(starsCount).to.equal(5)
      }
    })
  })
}

export function verifySorting(sort = 'ALL') {
  it(`${sort} - verify sorting`, updateRetry(2), () => {
    cy.get(`.${reviewsAndRatingsSelectors.reviewCommentRating}`, {
      timeout: 30000,
    }).should('be.visible')
    cy.get(reviewsAndRatingsSelectors.selectSort).select(sort)
    cy.get('div').should(
      'have.class',
      reviewsAndRatingsSelectors.reviewCommentRating
    )
  })
}

import { updateRetry } from './common/support'
import { PRODUCTS } from './products'

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
    cy.openProduct(PRODUCTS.coconut, true)
    cy.verifyStarsInProductRatingSummary(enableSettings)
  })

  it(
    `${type} display total reviews number in product rating summary`,
    updateRetry(2),
    () => {
      cy.openProduct(PRODUCTS.coconut, true)
      cy.verifyTotalReviewsInProductRatingSummary(enableSettings)
    }
  )

  it(
    `${type} display add review button in product rating summary`,
    updateRetry(2),
    () => {
      cy.openProduct(PRODUCTS.coconut, true)
      cy.verifyAddReviewButtonInProductRatingSummary(enableSettings)
    }
  )
}

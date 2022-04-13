import { updateRetry } from './common/support'
import { PRODUCTS } from './common/utils.js'

export function verifySettings(type, enableSettings = false, login = false) {
  it(`${type} display stars in product rating inline`, updateRetry(2), () => {
    cy.openStoreFront(login)
    cy.openProduct(PRODUCTS.waterMelon, false)
    cy.verifyStarsInProductRatingInline(enableSettings)
  })

  it(
    `${type} display graph and verify graph content is ${
      enableSettings ? '' : 'not '
    }displayed for anonymous user`,
    updateRetry(2),
    () => {
      cy.openProduct(PRODUCTS.waterMelon, true)
      cy.verifyGraphUI(enableSettings)
    }
  )

  it(`${type} Display stars in product rating summary`, updateRetry(2), () => {
    cy.verifyStarsInProductRatingSummary(enableSettings)
  })

  it(
    `${type} display total reviews number in product rating summary`,
    updateRetry(2),
    () => {
      cy.verifyTotalReviewsInProductRatingSummary(enableSettings)
    }
  )

  it(
    `${type} display add review button in product rating summary`,
    updateRetry(2),
    () => {
      cy.verifyAddReviewButtonInProductRatingSummary(enableSettings)
    }
  )
}

import { testSetup, updateRetry } from './common/support.js'
import rrselectors from './reviews_and_ratings.selectors.js'
import selectors from './common/selectors.js'

export function restrictAnonymousUser(product) {
  describe('Anonymous User', () => {
    testSetup(false)
    it(
      `Anonymous user should not be able to add review`,
      updateRetry(3),
      () => {
        cy.openStoreFront(false)
        cy.openProduct(product)
        cy.get(rrselectors.LoginLink).should('be.visible').click()
        cy.get(rrselectors.ForgotPassword).should('be.visible')
      }
    )
  })
}

export function verifyUserShouldBeAbletoAddReview() {
  it('User should not be able to add review again', () => {
    cy.get(rrselectors.WriteReview).click()
    cy.get(rrselectors.Danger).contains('already')
  })
}

export function orderTheProduct(product, postalCode) {
  it('Adding Product to Cart', updateRetry(3), () => {
    // Search the product
    cy.searchProduct(product)
    // Add product to cart
    cy.addProduct(product, { proceedtoCheckout: true })
  })

  it('Updating product quantity to 2', updateRetry(3), () => {
    // Update Product quantity to 2
    cy.updateProductQuantity(product, {
      quantity: '2',
      verifySubTotal: false,
    })
  })

  it('Updating Shipping Information', updateRetry(3), () => {
    // Update Shipping Section
    cy.updateShippingInformation({ postalCode })
  })

  it('Payment with promissory', () => {
    cy.promissoryPayment()
    cy.buyProduct()
    // This page take longer time to load. So, wait for profile icon to visible then get orderid from url
    cy.get(selectors.Search, { timeout: 30000 })
  })
}

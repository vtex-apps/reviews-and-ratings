import {
  testSetup,
  preserveCookie,
  updateRetry,
} from '../support/common/support.js'
import { testCase2 } from '../support/review_and_ratings.outputvalidation'
import selectors from '../support/common/selectors.js'

const { product, postalCode } = testCase2

describe('Order the product with Signed In User', () => {
  testSetup()
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

  preserveCookie()
})

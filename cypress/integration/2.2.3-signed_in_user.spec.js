import {
  loginViaCookies,
  updateRetry,
  preserveCookie,
} from '../support/common/support.js'
import { testCase2 } from '../support/outputvalidation.js'

const { title, configuration, product, user1 } = testCase2

describe(`${title} - Add review in ordered product`, () => {
  loginViaCookies()

  it(
    'Go to product detail page, verify default stars and add review',
    updateRetry(2),
    () => {
      cy.openStoreFront(true)
      cy.addReview(product, configuration.defaultStarsRating, user1)
    }
  )

  preserveCookie()
})

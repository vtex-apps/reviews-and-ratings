import {
  loginViaCookies,
  updateRetry,
  preserveCookie,
} from '../support/common/support.js'
import { testCase1 } from '../support/outputvalidation.js'
import { updateSettings } from '../support/graphql_testcase.js'

const { title, configuration, product, user1 } = testCase1

describe(title, () => {
  loginViaCookies({ storeFrontCookie: false })
  updateSettings(title, configuration)

  describe(`Signed in User`, () => {
    loginViaCookies()

    it('Adding review to product with location', updateRetry(2), () => {
      cy.openStoreFront(true)
      cy.addReview(product, configuration.defaultStarsRating, user1)
    })

    preserveCookie()
  })
})

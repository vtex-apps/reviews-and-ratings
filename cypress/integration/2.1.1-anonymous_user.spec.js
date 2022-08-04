import { loginViaCookies, updateRetry } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { testCase1 } from '../support/review_and_ratings.outputvalidation.js'
import { reload } from '../support/utils.js'
import { syncCheckoutUICustom } from '../support/common/testcase.js'

const { title, configuration, product, anonymousUser1, anonymousUser2 } =
  testCase1

describe(title, () => {
  loginViaCookies({ storeFrontCookie: false })
  updateSettings(title, configuration)
  syncCheckoutUICustom()

  describe('Anonymous User', () => {
    loginViaCookies({ storeFrontCookie: false })
    it('Adding review to product with location', updateRetry(2), () => {
      cy.openStoreFront()
      cy.addReview(product, configuration.defaultStarsRating, anonymousUser1)
    })

    it(
      'Verify anonymous user is able to add review again without location',
      updateRetry(2),
      () => {
        reload(anonymousUser2)
        cy.addReview(product, configuration.defaultStarsRating, anonymousUser2)
      }
    )
  })
})

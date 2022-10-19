import { loginViaCookies, updateRetry } from '../support/common/support.js'
import {
  getAverageRatingByProductId,
  graphql,
  updateSettings,
} from '../support/graphql_testcase.js'
import { testCase1 } from '../support/outputvalidation.js'
import { reload } from '../support/utils.js'
import { syncCheckoutUICustom } from '../support/common/testcase.js'

const {
  title,
  configuration,
  product,
  productId,
  anonymousUser1,
  anonymousUser2,
} = testCase1

describe(title, () => {
  loginViaCookies({ storeFrontCookie: false })

  updateSettings('Update default stars to 0 and verify', {
    defaultStarsRating: '0',
    validateDefaultStarsErrorMessage: true,
  })

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

    it('Verify get average of product by id query', updateRetry(4), () => {
      cy.addDelayBetweenRetries(2000)
      graphql(getAverageRatingByProductId(productId), response => {
        expect(response.body).to.not.have.own.property('errors')
        expect(response.body.data.averageRatingByProductId.average).to.equal(4)
        expect(response.body.data.averageRatingByProductId.starsThree).to.equal(
          1
        )
        expect(response.body.data.averageRatingByProductId.starsFive).to.equal(
          1
        )
      })
    })
  })
})

import { testSetup, preserveCookie } from '../support/common/support.js'
import { testCase2 } from '../support/review_and_ratings.outputvalidation'
import { orderTheProduct, restrictAnonymousUser } from '../support/testcase.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'

const { title, configuration, product, user1, postalCode } = testCase2

describe(title, () => {
  updateSettings(title, configuration)

  restrictAnonymousUser(product)

  describe('Order the product with Signed User', () => {
    testSetup()
    orderTheProduct(product, postalCode, configuration, user1)
    preserveCookie()
  })
})

import { loginViaCookies, preserveCookie } from '../support/common/support.js'
import { testCase1 } from '../support/outputvalidation.js'
import {
  verifyUserIsNotAbletoAddReviewAgain,
  verifyAverageRatings,
  addedReviewShouldShowToTheUser,
} from '../support/testcase.js'
import { updateSettings } from '../support/graphql_testcase.js'

const { product, user1, title, configuration } = testCase1

describe(title, () => {
  loginViaCookies({ storeFrontCookie: false })
  updateSettings(title, configuration)

  describe(`Verify review with Signed In User`, () => {
    loginViaCookies()

    addedReviewShouldShowToTheUser(product, user1.line)

    verifyAverageRatings(product, user1)

    verifyUserIsNotAbletoAddReviewAgain()

    preserveCookie()
  })
})

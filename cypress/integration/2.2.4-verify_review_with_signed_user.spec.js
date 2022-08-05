import { loginViaCookies, preserveCookie } from '../support/common/support.js'
import { testCase2 } from '../support/outputvalidation.js'
import {
  verifyAverageRatings,
  verifyUserIsNotAbletoAddReviewAgain,
  addedReviewShouldShowToTheUser,
} from '../support/testcase.js'

const { product, user1, title } = testCase2

describe(`${title} - Verify review with Signed In User`, () => {
  loginViaCookies()

  addedReviewShouldShowToTheUser(product, user1.line)

  verifyAverageRatings(product, user1)

  verifyUserIsNotAbletoAddReviewAgain()

  preserveCookie()
})

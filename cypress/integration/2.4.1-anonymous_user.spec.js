import { loginViaCookies } from '../support/common/support.js'
import { testCase4 } from '../support/outputvalidation.js'
import { updateSettings } from '../support/graphql_testcase.js'
import {
  restrictAnonymousUser,
  verifiedReviewTestCase,
  reviewTestCase,
  verifySorting,
} from '../support/testcase.js'
import { reviewsAndRatingsConstants } from '../support/constants.js'

const { title, configuration, product } = testCase4

describe(`${title} - Anonymous User`, () => {
  loginViaCookies({ storeFrontCookie: false })
  updateSettings(title, configuration)
  restrictAnonymousUser(product)
  verifiedReviewTestCase(testCase4)
  verifySorting(reviewsAndRatingsConstants.lowRated)
  reviewTestCase(testCase4)
})

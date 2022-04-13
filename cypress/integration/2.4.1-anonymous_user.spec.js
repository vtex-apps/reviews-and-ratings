import { testSetup } from '../support/common/support.js'
import { testCase4 } from '../support/review_and_ratings.outputvalidation'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import {
  restrictAnonymousUser,
  verifiedReviewTestCase,
  reviewTestCase,
  verifySorting,
} from '../support/testcase.js'
import { reviewsAndRatingsConstants } from '../support/reviews_and_ratings.constants.js'

const { title, configuration, product } = testCase4

describe(`${title} - Anonymous User`, () => {
  testSetup(false)
  updateSettings(title, configuration)
  restrictAnonymousUser(product)
  verifiedReviewTestCase(testCase4)
  verifySorting(reviewsAndRatingsConstants.lowRated)
  reviewTestCase(testCase4)
})

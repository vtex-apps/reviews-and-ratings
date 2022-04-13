import {
  testSetup,
  updateRetry,
  preserveCookie,
  loginAsUser,
} from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { testCase3 } from '../support/review_and_ratings.outputvalidation'
import {
  verifyFilter,
  verifiedReviewTestCase,
  reviewTestCase,
} from '../support/testcase.js'
import { reload } from '../support/utils.js'
import { reviewsAndRatingsConstants } from '../support/reviews_and_ratings.constants.js'
import {
  deleteReviews,
  verifyReviewIsDeleted,
  approveReviews,
} from '../support/graphql_testcase.js'

const { title, configuration, product, user1, verifiedProduct, user2 } =
  testCase3

describe(`${title} - Signed user`, () => {
  testSetup()
  updateSettings(title, configuration)

  it('Login & add review', updateRetry(3), () => {
    cy.getVtexItems().then(vtex => {
      loginAsUser(vtex.email, vtex.password)
      cy.openStoreFront()
      cy.addReview(product, configuration.defaultStarsRating, user1)
    })
  })

  it(
    'Verify user is able to add review for verified product',
    updateRetry(2),
    () => {
      reload(user2)
      cy.addReview(verifiedProduct, configuration.defaultStarsRating, user2)
    }
  )

  verifiedReviewTestCase(testCase3, true)
  verifyFilter(reviewsAndRatingsConstants.oneStar, false)
  verifyFilter(reviewsAndRatingsConstants.fourStars, true)
  reviewTestCase(testCase3, true)

  approveReviews(user2.name)
  deleteReviews(user1.name)
  verifyReviewIsDeleted(user1.name)

  preserveCookie()
})

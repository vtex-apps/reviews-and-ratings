import { testSetup } from '../support/common/support.js'
import { restrictAnonymousUser } from '../support/testcase.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { testCase2 } from '../support/review_and_ratings.outputvalidation'

const { title, configuration, product } = testCase2

describe(`${title} - Anonymous User`, () => {
  testSetup(false)
  updateSettings(title, configuration)
  restrictAnonymousUser(product)
})

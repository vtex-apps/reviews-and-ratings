import { testSetup } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'

describe('Basic', () => {
  testSetup()
  updateSettings('testcase', {
    allowAnonymousReviews: true,
    requireApproval: true,
  })
})

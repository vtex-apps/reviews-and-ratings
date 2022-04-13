import { testSetup } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { verifySettings } from '../support/review_and_ratings.js'

describe('Testing as anonymous user -> Disable display setting', () => {
  testSetup(false)
  updateSettings('Disable display setting')

  verifySettings('Disable', false, false)
})

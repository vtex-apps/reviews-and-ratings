import { preserveCookie, testSetup } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { verifySettings } from '../support/review_and_ratings.js'

describe('Enable display setting and test with signed in user', () => {
  testSetup()
  updateSettings('Enable display setting', {
    allowAnonymousReviews: true,
    showGraph: true,
    displaySummaryIfNone: true,
    displayInlineIfNone: true,
    displaySummaryTotalReviews: true,
    displaySummaryAddButton: true,
  })

  verifySettings('Enable', true, true)
  preserveCookie()
})

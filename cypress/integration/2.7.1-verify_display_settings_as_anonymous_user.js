import { testSetup } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { verifySettings } from '../support/review_and_ratings.js'

describe('Testing as anonymous user', () => {
  let type = 'Enable'

  describe('Enable display setting and test', () => {
    testSetup(false)
    updateSettings('Anonymous user enable all display setting', {
      allowAnonymousReviews: true,
      showGraph: true,
      displaySummaryIfNone: true,
      displayInlineIfNone: true,
      displaySummaryTotalReviews: true,
      displaySummaryAddButton: true,
    })

    verifySettings(type, true, false)
  })

  describe('Disable display setting and test', () => {
    type = 'Disable'
    testSetup(false)
    updateSettings('Anonymous user disable all display setting')

    verifySettings(type, false, false)
  })
})

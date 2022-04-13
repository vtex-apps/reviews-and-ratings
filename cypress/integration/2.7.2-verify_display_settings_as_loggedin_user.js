import { preserveCookie, testSetup } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { verifySettings } from '../support/review_and_ratings.js'

describe('Verify display settings as logged in user', () => {
  let type = 'Enable'

  describe('Enable display setting and test', () => {
    testSetup()
    updateSettings('testcase', {
      allowAnonymousReviews: true,
      showGraph: true,
      displaySummaryIfNone: true,
      displayInlineIfNone: true,
      displaySummaryTotalReviews: true,
      displaySummaryAddButton: true,
    })

    verifySettings(type, true, true)
    preserveCookie()
  })

  describe('Disable display setting and test', () => {
    testSetup()
    type = 'Disable'
    updateSettings('testcase', {
      showGraph: false,
      displaySummaryIfNone: false,
      displayInlineIfNone: false,
      displaySummaryTotalReviews: false,
      displaySummaryAddButton: false,
    })

    verifySettings(type, false, true)
    preserveCookie()
  })
})

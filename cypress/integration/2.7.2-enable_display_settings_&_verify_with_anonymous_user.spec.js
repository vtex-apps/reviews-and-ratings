import { loginViaCookies } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { verifySettings } from '../support/review_and_ratings.js'

describe('Testing as anonymous user -> Enable display setting and test', () => {
  loginViaCookies({ storeFrontCookie: false })
  updateSettings('Enable display setting and test', {
    allowAnonymousReviews: true,
    showGraph: true,
    displaySummaryIfNone: true,
    displayInlineIfNone: true,
    displaySummaryTotalReviews: true,
    displaySummaryAddButton: true,
  })

  verifySettings('Enable', true, false)
})

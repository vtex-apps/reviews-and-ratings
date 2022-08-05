import { loginViaCookies } from '../support/common/support.js'
import { updateSettings } from '../support/graphql_testcase.js'
import { verifySettings } from '../support/testcase.js'

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

import { preserveCookie, loginViaCookies } from '../support/common/support.js'
import { updateSettings } from '../support/graphql_testcase.js'
import { verifySettings } from '../support/testcase.js'

describe('Enable display setting and test with signed in user', () => {
  loginViaCookies()
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

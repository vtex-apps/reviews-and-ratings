import { preserveCookie, testSetup } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { verifySettings } from '../support/review_and_ratings.js'

describe('Testing as anonymous user', () => {
  // testSetup(false)

  let type = 'Enable'

  describe('Enable display setting and test', () => {
    testSetup(false)
    updateSettings('testcase', {
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
    updateSettings('testcase', {
      showGraph: false,
      displaySummaryIfNone: false,
      displayInlineIfNone: false,
      displaySummaryTotalReviews: false,
      displaySummaryAddButton: false,
    })

    verifySettings(type, false, false)
  })
})

describe('Testing as logged in user', () => {
  let type = 'Enable'

  testSetup()
  // before(() => {
  preserveCookie()
  // })

  describe('Enable display setting and test', () => {
    updateSettings('testcase', {
      allowAnonymousReviews: true,
      showGraph: true,
      displaySummaryIfNone: true,
      displayInlineIfNone: true,
      displaySummaryTotalReviews: true,
      displaySummaryAddButton: true,
    })

    verifySettings(type, true, true)
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
  })
})

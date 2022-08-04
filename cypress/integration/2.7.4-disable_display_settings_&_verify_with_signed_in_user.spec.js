import { preserveCookie, loginViaCookies } from '../support/common/support.js'
import { updateSettings } from '../support/review_and_ratings_settings.js'
import { verifySettings } from '../support/review_and_ratings.js'

describe('Disable display setting and test', () => {
  loginViaCookies()
  updateSettings('Disable display setting')

  verifySettings('Disable', false, true)
  preserveCookie()
})

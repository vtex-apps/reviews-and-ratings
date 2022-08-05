import { loginViaCookies } from '../support/common/support.js'
import { updateSettings } from '../support/graphql_testcase.js'
import { verifySettings } from '../support/testcase.js'

describe('Testing as anonymous user -> Disable display setting', () => {
  loginViaCookies({ storeFrontCookie: false })
  updateSettings('Disable display setting')

  verifySettings('Disable', false, false)
})

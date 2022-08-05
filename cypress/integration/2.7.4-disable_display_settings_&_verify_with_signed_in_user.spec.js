import { preserveCookie, loginViaCookies } from '../support/common/support.js'
import { updateSettings } from '../support/graphql_testcase.js'
import { verifySettings } from '../support/testcase.js'

describe('Disable display setting and test', () => {
  loginViaCookies()
  updateSettings('Disable display setting')

  verifySettings('Disable', false, true)
  preserveCookie()
})

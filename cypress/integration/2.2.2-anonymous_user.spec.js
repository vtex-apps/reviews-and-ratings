import { loginViaCookies } from '../support/common/support.js'
import { restrictAnonymousUser } from '../support/testcase.js'
import { updateSettings } from '../support/graphql_testcase.js'
import { testCase2 } from '../support/outputvalidation.js'

const { title, configuration, product } = testCase2

describe(`${title} - Anonymous User`, () => {
  loginViaCookies({ storeFrontCookie: false })
  updateSettings(title, configuration)
  restrictAnonymousUser(product)
})

import {
  getReviews,
  performDeleteReviews,
} from '../support/graphql_testcase.js'
import { updateRetry, loginViaCookies } from '../support/common/support.js'
import { graphql } from '../support/common/graphql_utils'
import { APP } from '../support/constants.js'

describe('Wipe the reviews/ratings', () => {
  loginViaCookies({ storeFrontCookie: false })
  it('Delete all the reviews/ratings', updateRetry(5), () => {
    graphql(APP, getReviews(''), resp => {
      const { reviews } = resp.body.data

      if (reviews) {
        const ids = reviews.data.map(({ id }) => id)

        performDeleteReviews(APP, ids)
      }
    })
  })
})

import {
  graphql,
  getReviews,
  performDeleteReviews,
} from '../support/graphql_testcase.js'
import { updateRetry, loginViaCookies } from '../support/common/support.js'

describe('Wipe the reviews/ratings', () => {
  loginViaCookies({ storeFrontCookie: false })
  it('Delete all the reviews/ratings', updateRetry(5), () => {
    graphql(getReviews(''), resp => {
      const { reviews } = resp.body.data

      if (reviews) {
        const ids = reviews.data.map(({ id }) => id)

        performDeleteReviews(ids)
      }
    })
  })
})

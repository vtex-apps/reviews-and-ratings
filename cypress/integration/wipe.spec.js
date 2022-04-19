import { graphql, getReviews } from '../support/graphql_queries.js'
import { performDeleteReviews } from '../support/graphql_testcase.js'
import { updateRetry, testSetup } from '../support/common/support.js'

describe('Wipe the reviews/ratings', () => {
  testSetup(false)
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

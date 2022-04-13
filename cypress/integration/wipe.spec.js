import { graphql, getReviews } from '../support/graphql_queries.js'
import { performDeleteReviews } from '../support/graphql_testcase.js'
import { updateRetry, testSetup } from '../support/common/support.js'

describe('Wipe the reviews/ratings', () => {
  testSetup()
  it('Delete all the reviews/ratings', updateRetry(5), () => {
    graphql(getReviews(''), resp => {
      const ids = resp.body.data.reviews.data.map(({ id }) => id)

      performDeleteReviews(ids)
    })
  })
})

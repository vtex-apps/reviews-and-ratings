import {
  graphql,
  getAverageRatingByProductId,
} from '../support/graphql_queries.js'
import { testSetup, updateRetry } from '../support/common/support.js'
import { testCase6 } from '../support/review_and_ratings.outputvalidation.js'

describe('Graphql queries', () => {
  const { anonymousUser1, anonymousUser2 } = testCase6
  const { productId } = anonymousUser1

  testSetup(false)

  it('Verify get average of product by id query', updateRetry(4), () => {
    cy.addDelayBetweenRetries(2000)
    graphql(getAverageRatingByProductId(productId), response => {
      expect(response.body.data.averageRatingByProductId).to.not.equal(null)
      expect(response.body.data.averageRatingByProductId).to.equal(
        anonymousUser2.rating
      )
    })
  })
})

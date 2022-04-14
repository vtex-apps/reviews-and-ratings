import { testSetup, updateRetry } from '../support/common/support.js'
import { graphql, addReviewQuery } from '../support/graphql_queries.js'
import { testCase6 } from '../support/review_and_ratings.outputvalidation.js'
import { approveReviews } from '../support/graphql_testcase.js'

const { anonymousUser1 } = testCase6
const { title } = anonymousUser1

describe('Graphql Add & Approve review', () => {
  testSetup(false)

  it('Verify adding review for product', updateRetry(2), () => {
    graphql(addReviewQuery(anonymousUser1), response => {
      expect(response.body.data.newReview).to.not.equal(null)
      cy.setReviewItem(title, response.body.data.newReview.id)
    })
  })

  approveReviews(title)
})

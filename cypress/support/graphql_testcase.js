import { graphql, getReview } from './graphql_queries.js'
import { updateRetry } from './common/support.js'

export function moderateReview(ids) {
  return {
    query:
      'mutation' +
      '($ids: [String!],$approved: Boolean!)' +
      '{moderateReview(ids:$ids,approved:$approved)}',
    queryVariables: {
      ids,
      approved: true,
    },
  }
}

export function validateModerateReviewResponse(response) {
  expect(response.body.data).to.have.property('moderateReview')
}

export function approveReviews(...ids) {
  it(`Approve all the reviews ${ids.toString()}`, updateRetry(2), () => {
    cy.getReviewItems().then(reviews => {
      const reviewIds = ids.map(id => reviews[id])

      graphql(moderateReview(reviewIds), validateModerateReviewResponse)
    })
  })
}

export function deleteReviewMutation(ids) {
  return {
    query: 'mutation' + '($ids: [String!])' + '{deleteReview(ids:$ids)}',
    queryVariables: {
      ids,
    },
  }
}

export function validateDeleteReviewResponse(response) {
  expect(response.body.data.deleteReview).to.be.true
}

export function performDeleteReviews(ids) {
  graphql(deleteReviewMutation(ids), validateDeleteReviewResponse)
}

export function deleteReviews(...ids) {
  it(`Delete all the reviews ${ids.toString()}`, updateRetry(2), () => {
    cy.getReviewItems().then(reviews => {
      const reviewIds = ids.map(id => reviews[id])

      performDeleteReviews(reviewIds)
    })
  })
}

export function verifyReviewIsDeleted(searchTerm) {
  it(`Verify reviews are deleted ${searchTerm}`, updateRetry(2), () => {
    cy.getReviewItems().then(review => {
      graphql(getReview(review[searchTerm]), response => {
        expect(response.body.data.review).to.equal(null)
      })
    })
  })
}

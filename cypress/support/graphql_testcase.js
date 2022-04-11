import { graphql } from './graphql_queries.js'

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

export function ValidateModerateReviewResponse(response) {
  expect(response.body.data.moderateReview).to.be.true
}

export function approveReviews(...ids) {
  it(`Approve all the reviews ${ids.toString()}`, () => {
    cy.getReviewItems().then(reviews => {
      const reviewIds = ids.map(id => reviews[id])

      graphql(moderateReview(reviewIds), ValidateModerateReviewResponse)
    })
  })
}

// export function deleteReviews(...ids) {
//   it(`Delete all the reviews ${ids.toString()}`, () => {
//     console.log(ids)
//     cy.getReviewItems().then(reviews => {
//       const reviewIds = ids.map(id => reviews[id])

//       graphql(moderateReview(reviewIds), ValidateModerateReviewResponse)
//     })
//   })
// }

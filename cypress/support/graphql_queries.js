import { FAIL_ON_STATUS_CODE } from './common/constants'

const config = Cypress.env()

// Constants
const { vtex } = config.base

export function graphql(getQuery, validateResponseFn) {
  const { query, queryVariables } = getQuery

  // Define constants
  const APP_NAME = 'vtex.reviews-and-ratings'
  const APP_VERSION = '*.x'
  const APP = `${APP_NAME}@${APP_VERSION}`
  const CUSTOM_URL = `${vtex.baseUrl}/_v/private/admin-graphql-ide/v0/${APP}`

  cy.request({
    method: 'POST',
    url: CUSTOM_URL,
    ...FAIL_ON_STATUS_CODE,
    body: {
      query,
      variables: queryVariables,
    },
  }).then(response => {
    expect(response.status).to.equal(200)
    expect(response.body.data).to.not.equal(null)
    validateResponseFn(response)
  })
}

export function getShopperIdQuery() {
  return {
    query:
      'query' +
      '($shopperId: String!)' +
      '{reviewsByShopperId(shopperId: $shopperId){data{id}}}',
    queryVariables: {
      shopperId: vtex.robotMail,
    },
  }
}

export function ValidateShopperIdResponse(response) {
  expect(response.body.data.reviewsByShopperId.data).to.have.length(3)
}

export function getReview(reviewId) {
  const ob = { id: reviewId }
  const query =
    'query' +
    '($id:ID!)' +
    '{ review(id: $id){id,title,text,rating,approved,productId,shopperId, verifiedPurchaser}}'

  return {
    query,
    queryVariables: ob,
  }
}

export function getReviews() {
  const ob = {
    from: 1,
    to: 10,
  }

  const query =
    'query' +
    '($from:Int, $to: Int)' +
    '{ reviews(from: $from, to: $to) {data {id, productId,rating, text}}}'

  return {
    query,
    queryVariables: ob,
  }
}

export function getAverageRatingByProductId(productId) {
  const ob = {
    productId,
  }

  const query =
    'query' +
    '($productId: String!)' +
    '{ averageRatingByProductId(productId: $productId)}'

  return {
    query,
    queryVariables: ob,
  }
}

export function reviewsByProductId(productId) {
  const ob = {
    productId,
  }

  const query =
    'query' +
    '($productId: String!)' +
    '{ reviewsByProductId(productId: $productId) {data {id, productId,rating, text}}}'

  return {
    query,
    queryVariables: ob,
  }
}

export function totalReviewsByProductId(productId) {
  const ob = {
    productId,
  }

  const query =
    'query' +
    '($productId: String!)' +
    '{ totalReviewsByProductId(productId: $productId)}'

  return {
    query,
    queryVariables: ob,
  }
}

export function addReviewQuery(review) {
  const ob = {
    review,
  }

  const query =
    'mutation' +
    '($review:ReviewInput!)' +
    '{ newReview(review: $review){id, productId, rating, text} }'

  return {
    query,
    queryVariables: ob,
  }
}

export function validateAddReviewResponse(response) {
  expect(response.body.data.newReview).to.not.equal(null)
}

// export function editReviewQuery(review, reviewId) {
//   const ob = {
//     id: reviewId,
//     review,
//   }

//   const query =
//     'mutation' +
//     '($id: String!, $review:EditReviewInput!)' +
//     '{ editReview(id: $id, review: $review){id, productId, rating, text} }'

//   return {
//     query,
//     queryVariables: ob,
//   }
// }

// export function validateEditReviewResponse(response) {
//   expect(response.body.data.review).to.not.equal(null)
// }

export function validateGetReviewResponse(response) {
  expect(response.body.data.review).to.not.equal(null)
}

export function validateGetReviewsResponse(response) {
  expect(response.body.data.reviews).to.not.equal(null)
}

export function validateReviewsByProductResponse(response) {
  expect(response.body.data.reviewsByProductId).to.not.equal(null)
}

export function validateAverageRatingByProductResponse(response) {
  expect(response.body.data.averageRatingByProductId).to.not.equal(null)
}

export function validateTotalReviewsByProductResponse(response) {
  expect(response.body.data.totalReviewsByProduct).to.not.equal(null)
}

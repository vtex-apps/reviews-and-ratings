import { FAIL_ON_STATUS_CODE } from './common/constants'

const config = Cypress.env()

// Constants
const { vtex } = config.base

export function graphql(getQuery, validateResponseFn = null) {
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
  }).as('RESPONSE')

  if (validateResponseFn) {
    cy.get('@RESPONSE').then(response => {
      expect(response.status).to.equal(200)
      expect(response.body.data).to.not.equal(null)
      validateResponseFn(response)
    })
  } else {
    return cy.get('@RESPONSE')
  }
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
  expect(response.body.data.reviewsByShopperId.data).to.not.have.length(0)
}

export function gethasShopperReviewedQuery() {
  return {
    query:
      'query' +
      '($shopperId: String!,$productId: String!)' +
      '{hasShopperReviewed(shopperId: $shopperId,productId: $productId)}',
    queryVariables: {
      shopperId: vtex.robotMail,
      productId: '880026',
    },
  }
}

export function ValidateHasShopperReviewedResponse(response) {
  expect(response.body.data.hasShopperReviewed).to.be.true
}

export function getreviewByreviewDateTimeQuery(reviewDateTime) {
  return {
    query:
      'query' +
      '($reviewDateTime:String!)' +
      '{reviewByreviewDateTime(reviewDateTime: $reviewDateTime){data{id}}}',
    queryVariables: {
      reviewDateTime,
    },
  }
}

export function ValidateGetreviewByreviewDateTimeQueryResponse(response) {
  expect(response.body.data.reviewByreviewDateTime.data).to.not.have.length(0)
}

export function getreviewByDateRangeQuery(reviewDateTime) {
  const date = reviewDateTime.split(' ')

  return {
    query:
      'query' +
      '($fromDate:String!,$toDate: String!)' +
      '{reviewByDateRange(fromDate: $fromDate,toDate:$toDate){data{id}}}',

    queryVariables: {
      fromDate: date[0],
      toDate: date[0],
    },
  }
}

export function ValidateGetreviewByDateRangeQueryResponse(response) {
  expect(response.body.data.reviewByDateRange.data).to.not.have.length(0)
}

export function getReview(reviewId) {
  const ob = { id: reviewId }
  const query =
    'query' +
    '($id:ID!)' +
    '{ review(id: $id){id,title,text,rating,approved,productId,verifiedPurchaser,reviewDateTime}}'

  return {
    query,
    queryVariables: ob,
  }
}

export function getReviews(searchTerm = false) {
  const ob = {
    from: 0,
    to: 40,
  }

  if (searchTerm) {
    ob.searchTerm = searchTerm
  }

  let query

  if (searchTerm) {
    query =
      'query' +
      '($from:Int, $to: Int,$searchTerm: String)' +
      '{ reviews(from: $from, to: $to,searchTerm: $searchTerm) {data {id,reviewerName}}}'
  } else {
    query =
      'query' +
      '($from:Int, $to: Int)' +
      '{ reviews(from: $from, to: $to) {data {id, productId,rating, text}}}'
  }

  return {
    query,
    queryVariables: ob,
  }
}

export function getAverageRatingByProductId(productId) {
  const query =
    'query' +
    '($productId: String!)' +
    '{ averageRatingByProductId(productId: $productId)}'

  return {
    query,
    queryVariables: {
      productId,
    },
  }
}

export function reviewsByProductId(productId) {
  const ob = {
    productId,
  }

  const query =
    'query' +
    '($productId: String!)' +
    '{ reviewsByProductId(productId: $productId) {data {id, productId,reviewerName}}}'

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

export function validateGetReviewsResponse(response) {
  expect(response.body.data.reviews).to.not.equal(null)
  expect(response.body.data.reviews.data).to.not.have.lengthOf(0)
}

export function validateReviewsByProductResponse(response) {
  expect(response.body.data.reviewsByProductId).to.not.equal(null)
}

export function validateTotalReviewsByProductResponse(response) {
  expect(response.body.data.totalReviewsByProduct).to.not.equal(null)
}

export function addReviewQuery(review) {
  const query =
    'mutation' + '($review:ReviewInput!)' + '{newReview(review: $review){id}}'

  return {
    query,
    queryVariables: {
      review,
    },
  }
}

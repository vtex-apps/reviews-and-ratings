import { updateRetry } from './common/support.js'
import { FAIL_ON_STATUS_CODE } from './common/constants'
import { graphql } from './common/graphql_utils.js'

const config = Cypress.env()

// Constants
const { vtex } = config.base

export function updateSettings(
  prefix,
  {
    allowAnonymousReviews,
    requireApproval,
    defaultOpen,
    defaultStarsRating,
    defaultOpenCount,
    showGraph,
    displaySummaryIfNone,
    displayInlineIfNone,
    displaySummaryTotalReviews,
    displaySummaryAddButton,
    validateDefaultStarsErrorMessage = false,
  } = {}
) {
  it(
    `In ${prefix} -Update Reviews and Ratings Settings`,
    updateRetry(3),
    () => {
      // Define constants
      const APP_NAME = 'vtex.apps-graphql'
      const APP_VERSION = '3.x'
      const APP = `${APP_NAME}@${APP_VERSION}`
      const CUSTOM_URL = `${vtex.baseUrl}/_v/private/admin-graphql-ide/v0/${APP}`

      const GRAPHQL_MUTATION =
        'mutation' +
        '($app:String,$version:String,$settings:String)' +
        '{saveAppSettings(app:$app,version:$version,settings:$settings){message}}'

      const req = {
        allowAnonymousReviews: allowAnonymousReviews || false,
        requireApproval: requireApproval || false,
        useLocation: true,
        defaultOpen: defaultOpen || false,
        defaultStarsRating: defaultStarsRating || '1',
        defaultOpenCount: defaultOpenCount || '4',
        showGraph: showGraph || false,
        displaySummaryIfNone: displaySummaryIfNone || false,
        displayInlineIfNone: displayInlineIfNone || false,
        displaySummaryTotalReviews: displaySummaryTotalReviews || false,
        displaySummaryAddButton: displaySummaryAddButton || false,
      }

      const QUERY_VARIABLES = {
        app: 'vtex.reviews-and-ratings',
        version: '*.x',
        settings: JSON.stringify(req),
      }

      cy.request({
        method: 'POST',
        url: CUSTOM_URL,
        ...FAIL_ON_STATUS_CODE,
        body: {
          query: GRAPHQL_MUTATION,
          variables: QUERY_VARIABLES,
        },
      }).then(response => {
        expect(response.status).to.equal(200)
        if (validateDefaultStarsErrorMessage) {
          expect(response.body.data.saveAppSettings).to.equal(null)
          expect(response.body).to.have.own.property('errors')
          expect(
            response.body.errors[0].extensions.exception.response.data.message
          ).to.include(
            'defaultStarsRating must be one of the following: "1", "2", "3", "4", "5"'
          )
        } else {
          expect(response.body.data.saveAppSettings.message).to.equal(
            JSON.stringify(req)
          )
        }
      })
    }
  )
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
  // expect(true).to.be.true
  expect(response.body.data.reviewByDateRange.data).to.not.have.lengthOf(0)
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
      '{ reviews(from: $from, to: $to,searchTerm: $searchTerm)@context(provider: "vtex.vtex.reviews-and-ratings@*.x") {data {id,reviewerName}}}'
  } else {
    query =
      'query' +
      '($from:Int, $to: Int)' +
      '{ reviews(from: $from, to: $to)@context(provider: "vtex.vtex.reviews-and-ratings@*.x") {data {id, productId,rating, text}}}'
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
    '{averageRatingByProductId(productId: $productId) {average}}'

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

export function editReview(reviewId, review) {
  const query =
    'mutation' +
    '($id: String!, $review:EditReviewInput!)' +
    '{editReview(id:$id,review: $review){id}}'

  return {
    query,
    queryVariables: {
      id: reviewId,
      review,
    },
  }
}

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

export function approveReviews(APP, ...ids) {
  it(`Approve all the reviews ${ids.toString()}`, updateRetry(2), () => {
    cy.getReviewItems().then(reviews => {
      const reviewIds = ids.map(id => reviews[id])

      graphql(APP, moderateReview(reviewIds), validateModerateReviewResponse)
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

export function performDeleteReviews(APP, ids) {
  graphql(APP, deleteReviewMutation(ids), validateDeleteReviewResponse)
}

export function deleteReviews(APP, ...ids) {
  it(`Delete all the reviews ${ids.toString()}`, updateRetry(2), () => {
    cy.getReviewItems().then(reviews => {
      const reviewIds = ids.map(id => reviews[id])

      performDeleteReviews(APP, reviewIds)
    })
  })
}

export function verifyReviewIsDeleted(APP, searchTerm) {
  it(`Verify reviews are deleted ${searchTerm}`, updateRetry(2), () => {
    cy.getReviewItems().then(review => {
      graphql(APP, getReview(review[searchTerm]), response => {
        expect(response.body.data.review).to.equal(null)
      })
    })
  })
}

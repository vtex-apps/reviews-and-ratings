import { FAIL_ON_STATUS_CODE } from './common/constants'

const config = Cypress.env()

// Constants
const { vtex } = config.base

export function graphql(getQuery, validateResponseFn) {
  const { query, queryVariables } = getQuery()

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

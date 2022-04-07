import {
  graphql,
  getShopperIdQuery,
  ValidateShopperIdResponse,
} from '../support/graphql_queries.js'

describe('Graphql queries', () => {
  it('Verify reviews by shopperId query', () => {
    graphql(getShopperIdQuery, ValidateShopperIdResponse)
  })
})

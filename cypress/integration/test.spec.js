import { testSetup } from '../support/common/support.js'
import { FAIL_ON_STATUS_CODE } from '../support/common/constants.js'

describe('Basic', () => {
  testSetup()
  it(`Update anonymous review `, () => {
    cy.getVtexItems().then(() => {
      // Define constants
      const APP_NAME = 'vtex.apps-graphql'
      const APP_VERSION = '3.x'
      const APP = `${APP_NAME}@${APP_VERSION}`
      const CUSTOM_URL = `https://reviewsandratings0469729--productusqa.myvtex.com/_v/private/admin-graphql-ide/v0/${APP}`
      const GRAPHQL_MUTATION =
        'mutation' +
        '($app:String,$version:String,$settings:String)' +
        '{saveAppSettings(app:$app,version:$version,settings:$settings){message}}'

      const req = {
        allowAnonymousReviews: true,
        requireApproval: false,
        useLocation: true,
        defaultOpen: false,
        defaultStarsRating: '0',
        defaultOpenCount: '4',
        showGraph: false,
        displaySummaryIfNone: true,
        displayInlineIfNone: true,
        displaySummaryTotalReviews: true,
        displaySummaryAddButton: true,
      }

      const QUERY_VARIABLES = {
        app: 'vtex.reviews-and-ratings',
        version: '3.x',
        settings: JSON.stringify(req),
      }

      // Mutating it to the new workspace
      cy.request({
        method: 'POST',
        url: CUSTOM_URL,
        ...FAIL_ON_STATUS_CODE,
        body: {
          query: GRAPHQL_MUTATION,
          variables: QUERY_VARIABLES,
        },
      }).then(resp => {
        cy.log(resp)
      })
    })
  })
})

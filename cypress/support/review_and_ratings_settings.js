import { FAIL_ON_STATUS_CODE } from './common/constants.js'

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
  } = {}
) {
  it(`In ${prefix} -Update Reviews and Ratings Settings`, () => {
    cy.getVtexItems().then(vtex => {
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
        defaultStarsRating: defaultStarsRating || '0',
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
        expect(response.body.data.saveAppSettings.message).to.equal(
          JSON.stringify(req)
        )
      })
    })
  })
}

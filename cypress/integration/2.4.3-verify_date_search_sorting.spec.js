import { loginViaCookies, updateRetry } from '../support/common/support.js'
import { selectDate, verifyExcelFile } from '../support/testcase.js'
// import  rrselectors  from '../support/selectors'

const fileName = 'cypress/downloads/reviews.xls'
const date = new Date()
const currentDate = date.getUTCDate()

describe('verify sorting for reviews', () => {
  loginViaCookies({ storeFrontCookie: false })
  it('Download reviews for some dates', updateRetry(2), () => {
    cy.getVtexItems().then(vtex => {
      cy.visit(`${vtex.baseUrl}/admin/app/reviews-ratings/download`)
      cy.contains('Reviews')
      selectDate({ day: currentDate, position: 1 })
      cy.contains('Apply').click()
      cy.get('.pa1 > .vtex-button').click()
      // cy.get(rrselectors.Download).click()
      // selectDate({day:'20',position:2})
    })
  })

  verifyExcelFile(fileName)
})

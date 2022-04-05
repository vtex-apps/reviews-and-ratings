export function reload() {
  // Writing review will work only if we go to some page so adding this
  cy.intercept('https://rc.vtex.com/v8').as('v8')
  cy.get('a[href*=food]').should('be.visible').click()
  cy.wait('@v8')
  cy.gotoProductDetailPage()
}

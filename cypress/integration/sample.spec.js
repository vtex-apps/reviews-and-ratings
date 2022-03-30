import { testSetup } from '../support/common/support.js'

describe('Basic', () => {
  testSetup()
  it('Here', () => {
    cy.visit('/')
  })
})

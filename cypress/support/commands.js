// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import selectors from './common/selectors'
import { generateAddtoCartCardSelector } from './common/utils'

Cypress.Commands.add('openProduct', product => {
  // Search product in search bar
  cy.get(selectors.Search)
    .should('be.visible')
    .clear()
    .type(product)
    .type('{enter}')
  cy.get(selectors.ProductAnchorElement)
    .should('have.attr', 'href')
    .then(href => {
      cy.get(generateAddtoCartCardSelector(href)).first().click()
    })
})

Cypress.Commands.add('addReview', (product, user) => {
  cy.openProduct(product)
  cy.get('.vtex-reviews-and-ratings-3-x-writeReviewButton').click()
  cy.fillReviewInformation(user)
})

Cypress.Commands.add('fillReviewInformation', user => {
  cy.get('.vtex-reviews-and-ratings-3-x-formBottomLine label div input')
    .clear()
    .type(user.line)
  cy.get(
    `.vtex-reviews-and-ratings-3-x-formRating > label > span:nth-child(2) > span:nth-child(${user.rating})`
  ).click()
  cy.get('.vtex-reviews-and-ratings-3-x-formName > label > div > input')
    .clear()
    .type(user.name)
  cy.get('.vtex-reviews-and-ratings-3-x-formEmail > label > div > input')
    .clear()
    .type(user.email)
  cy.get('.vtex-reviews-and-ratings-3-x-formReview > label > textarea')
    .clear()
    .type(user.review)
  cy.get('.vtex-reviews-and-ratings-3-x-formSubmit > button').click()
  cy.get('.vtex-reviews-and-ratings-3-x-formContainer > div > h5').should(
    'have.text',
    'Your review has been submitted.'
  )
})

Cypress.Commands.add('getAverageRating', (product, user) => {
  cy.get('#menu-item-category-home').click()
  cy.openProduct(product)
  cy.get('body').then($body => {
    const starsCount = $body.find(
      '.vtex-reviews-and-ratings-3-x-reviewsRating > div > span > .vtex-reviews-and-ratings-3-x-star--filled'
    ).length

    cy.log(starsCount)
    const averageStars = (starsCount + user.rating) / user.count

    cy.get('.review__rating--average')
      .invoke('text')
      .then(averageText => {
        const getAverage = averageText.split(' ')

        // eslint-disable-next-line radix
        expect(averageStars).to.equal(parseInt(getAverage[0]))
      })
  })
})

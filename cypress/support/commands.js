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
import reviewsAndRatingSelectors from './reviews_and_ratings.selectors'

Cypress.Commands.add('openProduct', (product, detailPage = false) => {
  // Search product in search bar
  cy.get(selectors.Search)
    .should('be.visible')
    .clear()
    .type(product)
    .type('{enter}')

  if (detailPage) {
    cy.get(selectors.ProductAnchorElement)
      .should('have.attr', 'href')
      .then(href => {
        cy.get(generateAddtoCartCardSelector(href)).first().click()
      })
  }
})

Cypress.Commands.add('addReview', (product, user) => {
  cy.openProduct(product, true)
  cy.get(reviewsAndRatingSelectors.writeReviewButton).click()
  cy.fillReviewInformation(user)
})

Cypress.Commands.add('fillReviewInformation', user => {
  cy.get(reviewsAndRatingSelectors.formBottomLine).clear().type(user.line)
  cy.get(
    `${reviewsAndRatingSelectors.ratingStar} > span:nth-child(${user.rating})`
  ).click()
  cy.get(reviewsAndRatingSelectors.formName).clear().type(user.name)
  cy.get(reviewsAndRatingSelectors.formEmail).clear().type(user.email)
  cy.get(reviewsAndRatingSelectors.formTextArea).clear().type(user.review)
  cy.get(reviewsAndRatingSelectors.formSubmit).click()
  cy.get(reviewsAndRatingSelectors.submittedReviewText).should(
    'have.text',
    'Your review has been submitted.'
  )
})

Cypress.Commands.add('getAverageRating', (product, user) => {
  cy.get('#menu-item-category-home').click()
  cy.openProduct(product, true)
  cy.get('body').then($body => {
    const starsCount = $body.find(reviewsAndRatingSelectors.starCount).length

    cy.log(starsCount)
    const averageStars = (starsCount + user.rating) / user.count

    cy.get(reviewsAndRatingSelectors.averageRating)
      .invoke('text')
      .then(averageText => {
        const getAverage = averageText.split(' ')

        // eslint-disable-next-line radix
        expect(averageStars).to.equal(parseInt(getAverage[0]))
      })
  })
})

Cypress.Commands.add('verifyGraphUI', (graph = false) => {
  if (graph) {
    cy.get('div').should('have.class', reviewsAndRatingSelectors.graphContent)
  } else {
    cy.get('div').should(
      'not.have.class',
      reviewsAndRatingSelectors.graphContent
    )
  }
})

Cypress.Commands.add('verifyStarsInProductRatingSummary', (enable = false) => {
  if (enable) {
    cy.get('div').should(
      'have.class',
      reviewsAndRatingSelectors.summaryContainer
    )
  } else {
    cy.get('div').should(
      'not.have.class',
      reviewsAndRatingSelectors.summaryContainer
    )
  }
})

Cypress.Commands.add('verifyStarsInProductRatingInline', (enable = false) => {
  if (enable) {
    cy.get('div').should(
      'have.class',
      reviewsAndRatingSelectors.inlineContainer
    )
  } else {
    cy.get('div').should(
      'not.have.class',
      reviewsAndRatingSelectors.inlineContainer
    )
  }
})

Cypress.Commands.add(
  'verifyTotalReviewsInProductRatingSummary',
  (enable = false) => {
    if (enable) {
      cy.get('span').should(
        'have.class',
        reviewsAndRatingSelectors.summaryTotalReviews
      )
    } else {
      cy.get('span').should(
        'not.have.class',
        reviewsAndRatingSelectors.summaryTotalReviews
      )
    }
  }
)

Cypress.Commands.add(
  'verifyAddReviewButtonInProductRatingSummary',
  (enable = false) => {
    if (enable) {
      cy.get('div').should(
        'have.class',
        reviewsAndRatingSelectors.summaryButtonContainer
      )
    } else {
      cy.get('div').should(
        'not.have.class',
        reviewsAndRatingSelectors.summaryButtonContainer
      )
    }
  }
)

Cypress.Commands.add('openStoreFront', (login = false) => {
  cy.intercept('**/rc.vtex.com.br/api/events').as('events')
  cy.visit('/')
  cy.wait('@events')
  if (login === true) {
    cy.get(selectors.ProfileLabel)
      .should('be.visible')
      .should('have.contain', `Hello,`)
  }
})

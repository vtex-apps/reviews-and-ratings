import selectors from './common/selectors'
import { generateAddtoCartCardSelector } from './common/utils'
import rrselectors from './reviews_and_ratings.selectors.js'
import { promissoryPayment, buyProduct } from './common/support.js'

Cypress.Commands.add('promissoryPayment', promissoryPayment)
Cypress.Commands.add('buyProduct', buyProduct)

Cypress.Commands.add('gotoProductDetailPage', () => {
  cy.get(selectors.ProductAnchorElement)
    .should('have.attr', 'href')
    .then(href => {
      cy.get(generateAddtoCartCardSelector(href)).first().click()
    })
})

Cypress.Commands.add('openProduct', (product, detailPage = false) => {
  // Search product in search bar
  cy.get(selectors.Search).should('be.not.disabled').should('be.visible')

  cy.get(selectors.Search).type(`${product}{enter}`)
  // Page should load successfully now Filter should be visible
  cy.get(selectors.searchResult).should('have.text', product.toLowerCase())
  cy.get(selectors.FilterHeading, { timeout: 30000 }).should('be.visible')

  if (detailPage) {
    cy.gotoProductDetailPage()
    cy.get(rrselectors.PostalCode, { timeout: 20000 }).should('be.visible')
    cy.get('.vtex-reviews-and-ratings-3-x-writeReviewButton').should(
      'be.visible'
    )
  } else {
    cy.log('Visiting detail page is disabled')
  }
})

Cypress.Commands.add('addReview', (product, defaultStarsRating, user) => {
  // Search the product
  cy.get('body').then($body => {
    if ($body.find(`img[alt="${product}"]`).length > 0) {
      cy.get(`img[alt="${product}"]`).should('be.visible').click()
    } else if (
      $body.find('.vtex-reviews-and-ratings-3-x-writeReviewButton').length === 0
    ) {
      cy.openProduct(product)
    }

    cy.get('.vtex-reviews-and-ratings-3-x-writeReviewButton', {
      timeout: 40000,
    }).should('be.visible')
    cy.getAverageRating(user, product, false).then(match => {
      if (!match) {
        cy.get('.vtex-reviews-and-ratings-3-x-writeReviewButton').click()
        cy.get('.vtex-reviews-and-ratings-3-x-formSubmit > button').should(
          'be.visible'
        )
        // TODO: For promotional product, default stars is not showing corectly
        // cy.get(rrselectors.StarsFilled)
        //   .its('length')
        //   .should('eq', +defaultStarsRating)
        cy.fillReviewInformation(user)
      } else {
        cy.log('Review is been already added in storefront')
      }
    })
  })
})

Cypress.Commands.add('fillReviewInformation', user => {
  const { line, name, email, review } = user

  cy.get('.vtex-reviews-and-ratings-3-x-formBottomLine label div input')
    .clear()
    .type(line)
  cy.get(
    `.vtex-reviews-and-ratings-3-x-formRating > label > span:nth-child(2) > span:nth-child(${user.rating})`
  ).click()
  cy.get('.vtex-reviews-and-ratings-3-x-formName > label > div > input')
    .clear()
    .type(name)
  if (email) {
    cy.get('.vtex-reviews-and-ratings-3-x-formEmail > label > div > input')
      .clear()
      .type(email)
  }

  cy.get('.vtex-reviews-and-ratings-3-x-formReview > label > textarea')
    .clear()
    .type(review)
  cy.get('.vtex-reviews-and-ratings-3-x-formSubmit > button').click()
  cy.get('.vtex-reviews-and-ratings-3-x-formContainer > div > h5').should(
    'have.text',
    'Your review has been submitted.'
  )
})

Cypress.Commands.add('getAverageRating', (user, product, validate = true) => {
  const { average, verified } = user

  if (validate) {
    cy.openProduct(product)
  }

  cy.get('span[class*=average]', { timeout: 40000 })
    .invoke('text')
    .then(averageText => {
      const getAverage = averageText.split(' ')

      if (validate) {
        expect(average).to.equal(+getAverage[0])
      } else if (average === +getAverage[0]) {
        return cy.wrap(true)
      } else {
        return cy.wrap(false)
      }

      if (verified) {
        cy.contains('Verified Purchaser')
      }
    })
})

Cypress.Commands.add('verifyGraphUI', (graph = false) => {
  if (graph) {
    cy.get('div').should('have.class', rrselectors.graphContent)
  } else {
    cy.get('div').should('not.have.class', rrselectors.graphContent)
  }
})

Cypress.Commands.add('verifyStarsInProductRatingSummary', (enable = false) => {
  if (enable) {
    cy.get('div').should('have.class', rrselectors.summaryContainer)
  } else {
    cy.get('div').should('not.have.class', rrselectors.summaryContainer)
  }
})

Cypress.Commands.add('verifyStarsInProductRatingInline', (enable = false) => {
  if (enable) {
    cy.get('div').should('have.class', rrselectors.inlineContainer)
  } else {
    cy.get('div').should('not.have.class', rrselectors.inlineContainer)
  }
})

Cypress.Commands.add(
  'verifyTotalReviewsInProductRatingSummary',
  (enable = false) => {
    if (enable) {
      cy.get('span').should('have.class', rrselectors.summaryTotalReviews)
    } else {
      cy.get('span').should('not.have.class', rrselectors.summaryTotalReviews)
    }
  }
)

Cypress.Commands.add(
  'verifyAddReviewButtonInProductRatingSummary',
  (enable = false) => {
    if (enable) {
      cy.get('div').should('have.class', rrselectors.summaryButtonContainer)
    } else {
      cy.get('div').should('not.have.class', rrselectors.summaryButtonContainer)
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

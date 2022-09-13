import selectors from './common/selectors'
import { generateAddtoCartCardSelector } from './common/utils'
import rrselectors from './selectors.js'
import { promissoryPayment, buyProduct } from './common/support.js'
import { graphql, getReviews } from './graphql_testcase.js'
import { PRODUCT_ID_MAPPING, MESSAGES } from './utils.js'

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
  } else {
    cy.log('Visiting detail page is disabled')
  }
})

Cypress.Commands.add(
  'addReview',
  (product, defaultStarsRating, user, reviewSubmitted = false) => {
    // eslint-disable-line
    cy.addDelayBetweenRetries(1000)
    // Search the product
    cy.get('body').then($body => {
      graphql(getReviews(PRODUCT_ID_MAPPING[product]), resp => {
        const object = resp.body.data.reviews.data.find(
          ob => ob.reviewerName === user.name
        )

        if (!object && !reviewSubmitted) {
          if ($body.find(`img[alt="${product}"]`).length > 0) {
            cy.get(`img[alt="${product}"]`).should('be.visible').click()
          } else if ($body.find(rrselectors.WriteReview).length === 0) {
            cy.openProduct(product, true)
          }

          cy.get(rrselectors.WriteReview, {
            timeout: 20000,
          })
            .should('be.visible')
            .click()

          cy.fillReviewInformation(user, product)
          cy.addReview(product, defaultStarsRating, user, true)
        } else {
          cy.log('Review is already created storing its order id')
          cy.setReviewItem(user.name, object.id)
        }

        cy.getReviewItems().then(review => {
          expect(review[user.name]).to.not.equal(undefined)
        })
      })
    })
  }
)

Cypress.Commands.add('fillReviewInformation', user => {
  const { email, line, rating, name, review } = user

  cy.get(rrselectors.formBottomLine).clear().type(line)
  cy.get(`${rrselectors.ratingStar} > span:nth-child(${rating})`).click()
  cy.get(rrselectors.formName).clear().type(name)
  if (email) {
    cy.get(rrselectors.formEmail).clear().type(email)
  }

  cy.get(rrselectors.formTextArea).clear().type(review)
  cy.get(rrselectors.formSubmit).should('be.visible').click()
  cy.get(rrselectors.submittedReviewText, { timeout: 30000 })
    .should('be.visible')
    .should('have.text', MESSAGES.ReviewSubmitted)
})

function justNumbers(string) {
  const regex = /[+-]?\d+(\.\d+)?/g

  return parseFloat(string.match(regex)[0])
}

Cypress.Commands.add('getAverageRating', (user, product, validate = true) => {
  const { average, verified } = user

  if (validate) {
    cy.openProduct(product, true)
  }

  cy.get('span[class*=average]').should('not.contain', '0')

  cy.get('span[class*=average]', { timeout: 40000 })
    .invoke('text')
    .then(averageText => {
      const averageRating = justNumbers(averageText)

      if (validate) {
        expect(average).to.equal(averageRating)
      } else if (average === averageRating[0]) {
        return cy.wrap(true)
      } else {
        return cy.wrap(false)
      }

      if (verified) {
        cy.contains(MESSAGES.VerifiedPurchaser)
      }
    })
})

Cypress.Commands.add('verifyGraphUI', (graph = false) => {
  if (graph) {
    cy.get(rrselectors.graphContent).should('exist')
  } else {
    cy.get(rrselectors.graphContent).should('not.exist')
  }
})

Cypress.Commands.add('verifyStarsInProductRatingSummary', (enable = false) => {
  if (enable) {
    cy.get(rrselectors.summaryContainer).should('exist')
  } else {
    cy.get(rrselectors.summaryContainer).should('not.exist')
  }
})

Cypress.Commands.add('verifyStarsInProductRatingInline', (enable = false) => {
  if (enable) {
    cy.get(rrselectors.inlineContainer).should('exist')
  } else {
    cy.get(rrselectors.inlineContainer).should('not.exist')
  }
})

Cypress.Commands.add(
  'verifyTotalReviewsInProductRatingSummary',
  (enable = false) => {
    if (enable) {
      cy.get(rrselectors.summaryTotalReviews).should('exist')
    } else {
      cy.get(rrselectors.summaryTotalReviews).should('not.exist')
    }
  }
)

Cypress.Commands.add(
  'verifyAddReviewButtonInProductRatingSummary',
  (enable = false) => {
    if (enable) {
      cy.get(rrselectors.summaryButtonContainer).should('exist')
    } else {
      cy.get(rrselectors.summaryButtonContainer).should('not.exist')
    }
  }
)

Cypress.Commands.add('openStoreFront', (login = false) => {
  cy.intercept('**/rc.vtex.com.br/api/events').as('events')
  cy.visit('/')
  cy.wait('@events')
  if (login === true) {
    cy.get(selectors.ProfileLabel, { timeout: 20000 })
      .should('be.visible')
      .should('have.contain', `Hello,`)
  }
})

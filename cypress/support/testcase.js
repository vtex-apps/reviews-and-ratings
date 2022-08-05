import { loginViaCookies, updateRetry } from './common/support.js'
import rrselectors from './selectors.js'
import { reload, MESSAGES } from './utils.js'
import { reviewsAndRatingsConstants } from './constants.js'
import { PRODUCTS } from './common/utils.js'

export function restrictAnonymousUser(product) {
  loginViaCookies({ storeFrontCookie: false })
  it(`Anonymous user should not be able to add review`, updateRetry(3), () => {
    cy.openStoreFront()
    cy.openProduct(product, true)
    cy.get(rrselectors.LoginLink).should('be.visible').click()
    cy.get(rrselectors.ForgotPassword).should('be.visible')
  })
}

export function verifyUserIsNotAbletoAddReviewAgain() {
  it('User should not be able to add review again', () => {
    cy.get(rrselectors.WriteReview).click()
    cy.get(rrselectors.Danger).contains(MESSAGES.AlreadySubmitted)
  })
}

export function verifyFilter(filter, reviews = true) {
  it(
    `Filter by ${filter} should ${reviews ? '' : 'not'} show reviews`,
    updateRetry(2),
    () => {
      cy.get(rrselectors.selectFilter).select(filter)
      cy.get(rrselectors.reviewCommentRating, {
        timeout: 30000,
      }).should('be.visible')
      if (reviews) {
        cy.get('body').then(async $body => {
          const starsCount = $body.find(rrselectors.reviewStarsCount).length

          if (starsCount > 0) {
            expect(starsCount).to.equal(parseInt(filter, 10))
          }
        })
      } else {
        cy.get('h5').should('contain', MESSAGES.NoReviews)
      }
    }
  )
}

export function verifySorting(sort) {
  it(`Verifying sorting by ${sort}`, updateRetry(4), () => {
    cy.addDelayBetweenRetries(500)
    cy.get(rrselectors.reviewCommentRating, {
      timeout: 30000,
    }).should('be.visible')
    cy.get(rrselectors.selectSort).select(sort)
    cy.get(rrselectors.ReviewContainer).should('have.length', '2')
    cy.get(rrselectors.GetReviewByIndex(1)).then(review1 => {
      const starsCount1 = Cypress.$(review1).length

      cy.get(rrselectors.GetReviewByIndex(2)).then(review2 => {
        const starsCount2 = Cypress.$(review2).length

        if (sort === reviewsAndRatingsConstants.lowRated) {
          expect(starsCount1).to.be.lessThan(starsCount2)
        } else if (sort === reviewsAndRatingsConstants.highRated) {
          expect(starsCount1).to.be.greaterThan(starsCount2)
        }
      })
    })
  })
}

export function verifiedReviewTestCase({ verifiedProduct }, user = false) {
  const title = user ? 'signed in' : 'anonymous'

  it(`Validate verified user added comments shown to ${title} user`, () => {
    cy.openProduct(verifiedProduct, true)
    cy.contains(MESSAGES.VerifiedPurchaser)
  })
}

export function reviewTestCase({ otherProduct }, user = false) {
  const title = user ? 'signed in' : 'anonymous'

  it(`Validate user added comments shown to this ${title} user`, () => {
    reload()
    cy.openProduct(otherProduct, true)
    cy.get('h5').should('not.contain', MESSAGES.NoReviews)
  })
}

export function addedReviewShouldShowToTheUser(product, line) {
  it('Added review should show immediately to the user', updateRetry(2), () => {
    cy.openStoreFront(true)
    cy.openProduct(product, true)
    cy.get(rrselectors.PostalCode, { timeout: 20000 }).should('be.visible')
    cy.get(rrselectors.ReviewComment).contains(line)
  })
}

export function verifySettings(type, enableSettings = false, login = false) {
  it(`${type} display stars in product rating inline`, updateRetry(2), () => {
    cy.openStoreFront(login)
    cy.openProduct(PRODUCTS.waterMelon, false)
    cy.verifyStarsInProductRatingInline(enableSettings)
  })

  it(
    `${type} display graph and verify graph content is ${
      enableSettings ? '' : 'not '
    }displayed for anonymous user`,
    updateRetry(2),
    () => {
      cy.openProduct(PRODUCTS.waterMelon, true)
      cy.verifyGraphUI(enableSettings)
    }
  )

  it(`${type} Display stars in product rating summary`, () => {
    cy.verifyStarsInProductRatingSummary(enableSettings)
  })

  it(`${type} display total reviews number in product rating summary`, () => {
    cy.verifyTotalReviewsInProductRatingSummary(enableSettings)
  })

  it(`${type} display add review button in product rating summary`, () => {
    cy.verifyAddReviewButtonInProductRatingSummary(enableSettings)
  })
}

export function verifyAverageRatings(product, user) {
  it('Verify average ratings', () => {
    cy.getAverageRating(user, product)
  })
}

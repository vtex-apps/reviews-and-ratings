import { updateRetry } from './common/support.js'
import { VTEX_AUTH_HEADER, FAIL_ON_STATUS_CODE } from './common/constants'
import { ratingsAPI, deleteReviewAPI, deleteReviewAPIs } from './product.apis'

export function getProductRatingsAPI(productId) {
  it('Get rating for product', () => {
    cy.getVtexItems().then(vtex => {
      cy.getAPI(ratingsAPI(vtex.baseUrl, `rating/${productId}`), {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }).then(res => {
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('average')
        expect(res.body).to.have.property('totalCount')
      })
    })
  })
}

export function addReviewAPI(product, user, duplicate = false) {
  it('Add review and rating for product', () => {
    cy.getVtexItems().then(vtex => {
      cy.request({
        method: 'POST',
        url: ratingsAPI(vtex.baseUrl, 'review'),
        headers: {
          VtexIdclientAutCookie: vtex.userAuthCookieValue,
        },
        body: {
          ProductId: product,
          Rating: user.rating,
          Title: `Testing ${user.name}`,
          Text: user.review,
        },
      }).then(response => {
        expect(response.status).to.equal(200)
        if (!duplicate) {
          expect(response.body).to.not.equal('Duplicate Review')
          cy.setReviewItem(user.name, response.body)
        } else {
          expect(response.body).to.equal('Duplicate Review')
        }
      })
    })
  })
}

export function retriveReviewAPI(product, user) {
  it('Retrive review for product', updateRetry(5), () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        cy.getAPI(ratingsAPI(vtex.baseUrl, `review/${review[user.name]}`), {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.not.equal(null)
          expect(response.body.productId).to.equal(product.toString())
        })
      })
    })
  })
}

export function retriveReviewsListAPI(productId) {
  it(
    'Retrive list of reviews for product and verify created review',
    updateRetry(4),
    () => {
      cy.getVtexItems().then(vtex => {
        cy.getAPI(ratingsAPI(vtex.baseUrl, `reviews?product_id=${productId}`), {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.not.equal(null)
        })
      })
    }
  )
}

export function deleteReview(user) {
  it('Delete review for this id', () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        cy.request({
          method: 'DELETE',
          url: deleteReviewAPI(vtex.baseUrl, `${review[user.name]}`),
          headers: {
            VtexIdclientAutCookie: vtex.userAuthCookieValue,
          },
          ...FAIL_ON_STATUS_CODE,
        }).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.be.true
        })
      })
    })
  })
}

export function deleteReviews(user1, user2) {
  it('Delete multiple reviews', () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        const reviewIds = [review[user1.name], review[user2.name]]

        cy.request({
          method: 'DELETE',
          url: deleteReviewAPIs(vtex.baseUrl),
          headers: {
            ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          },
          body: JSON.stringify(reviewIds),
          ...FAIL_ON_STATUS_CODE,
        }).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.be.true
        })
      })
    })
  })
}

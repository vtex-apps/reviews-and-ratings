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

export function addReviewAPI(productId, user) {
  it('Add review and rating for product', () => {
    cy.getVtexItems().then(vtex => {
      cy.request({
        method: 'POST',
        url: ratingsAPI(vtex.baseUrl, 'review'),
        headers: {
          VtexIdclientAutCookie: vtex.adminAuthCookieValue,
        },
        body: {
          ProductId: productId,
          Rating: user.rating,
          Title: '',
          Text: user.review,
        },
      }).then(response => {
        expect(response.status).to.equal(200)
        expect(response.body).to.not.equal('Duplicate Review')
        cy.setReviewItem(`ReviewID-${productId}`, response.body)
      })
    })
  })
}

export function retriveReviewAPI(productId) {
  it('Retrive review for product', () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        cy.getAPI(
          ratingsAPI(vtex.baseUrl, `review/${review[`ReviewID-${productId}`]}`),
          {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        ).then(response => {
          expect(response.status).to.equal(200)
          expect(response.body).to.not.equal(null)
          expect(response.body.productId).to.equal(productId.toString())
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
        cy.getReviewItems().then(review => {
          // cy.wait(3000)
          cy.getAPI(
            ratingsAPI(vtex.baseUrl, `reviews?product_id=${productId}`),
            {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            }
          ).then(response => {
            expect(response.status).to.equal(200)
            expect(response.body).to.not.equal(null)
            expect(response.body.data[0].id).to.equal(
              review[`ReviewID-${productId}`]
            )
          })
        })
      })
    }
  )
}

export function deleteReview(reviewEnv) {
  it('Delete review for this id', () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        cy.request({
          method: 'DELETE',
          url: deleteReviewAPI(vtex.baseUrl, `review/${review[reviewEnv]}`),
          headers: {
            ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          },
          ...FAIL_ON_STATUS_CODE,
        }).then(response => {
          expect(response.status).to.equal(200)
        })
      })
    })
  })
}

export function deleteReviews(reviews) {
  it('Delete multiple reviews', () => {
    cy.getVtexItems().then(vtex => {
      // cy.getReviewItems().then(review => {
      cy.request({
        method: 'DELETE',
        url: deleteReviewAPIs(vtex.baseUrl),
        headers: {
          ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
        },
        body: reviews,
        ...FAIL_ON_STATUS_CODE,
      }).then(response => {
        expect(response.status).to.equal(200)
      })
    })
    // })
  })
}

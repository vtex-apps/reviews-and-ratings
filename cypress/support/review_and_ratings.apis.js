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

export function addReviewAPI(env, user, duplicate = false) {
  const { product, reviewapienv } = env

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
          Title: 'Testing',
          Text: user.review,
        },
      }).then(response => {
        expect(response.status).to.equal(200)
        if (!duplicate) {
          expect(response.body).to.not.equal('Duplicate Review')
          cy.setReviewItem(`${reviewapienv}-${product}`, response.body)
        } else {
          expect(response.body).to.equal('Duplicate Review')
        }
      })
    })
  })
}

export function retriveReviewAPI(env) {
  const { product, reviewapienv } = env

  it('Retrive review for product', updateRetry(5), () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        cy.getAPI(
          ratingsAPI(
            vtex.baseUrl,
            `review/${review[`${reviewapienv}-${product}`]}`
          ),
          {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        ).then(response => {
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

export function deleteReview(env) {
  const { product, reviewapienv } = env

  it('Delete review for this id', () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        cy.request({
          method: 'DELETE',
          url: deleteReviewAPI(
            vtex.baseUrl,
            `${review[`${reviewapienv}-${product}`]}`
          ),
          headers: {
            VtexIdclientAutCookie: vtex.userAuthCookieValue,
          },
          ...FAIL_ON_STATUS_CODE,
        }).then(response => {
          expect(response.status).to.equal(200)
        })
      })
    })
  })
}

export function deleteReviews() {
  it('Delete multiple reviews', () => {
    cy.getVtexItems().then(vtex => {
      cy.getReviewItems().then(review => {
        const reviewIds = []

        for (const [key, value] of Object.entries(review)) {
          reviewIds.push(value)
        }

        cy.request({
          method: 'DELETE',
          url: deleteReviewAPIs(vtex.baseUrl),
          headers: {
            ...VTEX_AUTH_HEADER(vtex.apiKey, vtex.apiToken),
          },
          body: reviewIds,
          ...FAIL_ON_STATUS_CODE,
        }).then(response => {
          expect(response.status).to.equal(200)
        })
      })
    })
  })
}
